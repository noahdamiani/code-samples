/** 
 * 
 *  Used for converting dashed html-element 
 *  references to camelcased properties in the localDOM
 *  ie. app-header -> this.$.appHeader
 * 
 *  */
const camelCased = (str: string) => str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

/**
 * Parameter index signatures
 */
export interface parameter {
  [key: string]: any;
}

/**
 * Application options
 */
export interface AppOptions {
  element: Element | null; // Application container element
  routes: route; // Routes for the application
  templateDirectory: string; // Soy templates main directory
  partialsDir: string; // Soy partials directory
  debug?: Boolean; // Debug mode, TODO
}

/**
 * Routed component structure
 */
interface componentRoute {
  name: string;
  component: any;
  params: Array<any>;
}

export const routeComponent = (name: string, component: any, params?: any) => {
  return <componentRoute>{
    "name": name,
    "component": component,
    "params": params
  }
}

/**
 * Interfaces for routes and the local DOM
 */
export interface route {
  [key: string]: Function;
}

export interface localDOM {
  [key: string]: Element | null;
}

/**
 * 
 * Main application code. Handles components and routing.
 * 
 */

export class Application {
  // Index signature allows us to provide a dynamic get() function on the extended class
  [key: string]: any; 
  $: localDOM = {}; // localDOM, allows developer to access child components
  app: Element | null; // Application container element
  currentModule: Array<string> = []; // Array that holds all the visited routes
  components: Map<string, any> = new Map(); // Map of registered components
  events: Map<string, Function> = new Map(); // Map of application events
  partials: Map<string, BaseView> = new Map(); // Map of all the partial components
  partialsDir: string; // Soy partials directory
  routes: route; // Routes
  soyDir: string; // Soy templates main directory  

  constructor(options: AppOptions) {
    /**
     *  Bind options to new application instance
     * */
    this.soyDir = options.templateDirectory;
    this.partialsDir = options.partialsDir;
    this.app = options.element || document.body; // Defaults to document.body if no element provided or element null.
    this.routes = options.routes;

    /** 
     * Event listener for history pushstate.
     * Dispatches routing when onpopstate is triggered.
     */
    window.onpopstate = () => {
      const URIFields = this.parseURI(window.location.pathname);
      this.go(options.routes, URIFields);
    };

    /**
     * Initializes the single page app logic.
     */
    
    this.singlePage(options.routes, this.parseURI(window.location.pathname));
  }

  /**
   * Binds partials to the application.
   * 
   * @param dataToBind The child components to bind
   * 
   */
  protected bind(dataToBind: Array<string>) {
    if (dataToBind) {
      let d = { TEMPLATE_ID: '', SOY_PATH: this.partialsDir, PARTIAL: true }
      dataToBind.forEach((data: string) => {
        // html-element:soyfilename -> datatobind
        const el = data.split(" -> ")[0].split(":")[0], // "html-element"
          template = data.split(" -> ")[0].split(":")[1], // "soyfilename"
          dtb = data.split(" -> ")[1] // "datatobind"
        /** 
         * We need to create the proper object structure to be read by the component logic 
         * */
        const componentPayload: any = {};
        componentPayload[dtb] = this.get(dtb);
        d.TEMPLATE_ID = el;
        this.$[camelCased(el)] = document.querySelector(el);
        /**
         * Create the component
         */
        new BaseView(Object.assign(d, { key: template, data: componentPayload }), template);
      })
    }
  }

  /**
   * Defines the onRouteChange method to be accessed by new Applications
   */
  protected onRouteChange({}) {}

  /**
   * Takes a URI and gives back the page name and parameters
   * 
   * @param pathname The window pathname
   * 
   */
  parseURI(pathname: string) {
    const params = pathname.split("/").slice(2),
          page = pathname.split("/")[1]
    return { page: page, params: params };
  }


  /**
   * 
   * Fires routing to components.
   * 
   * @param routes The application's routes.
   * @param params The parameters of the route to navigate to.
   * @param transition Optional transitions on anchor click.
   * 
   */
  go(routes: route, params?: any, transition?: boolean) {
    const mtd = routes[params.page];
    const component = mtd(params.params);
    this.component(component.name, component.component, component.params, transition);
    setTimeout(() => {
      this.onRouteChange(Object.assign({ path: window.location.pathname }, component))
      window.scrollTo(0, 0); 
    }, 0);
  }

  /**
   * Initializes routing by firing the initial routing function
   * Overrides default anchor href functionality with preventDefault
   * and pushState
   * 
   * @param routes The application's routes.
   * @param params The parameters of the route to navigate to.
   */
  singlePage(routes: route, params: any) {
    this.go(routes, params, true);
    document.addEventListener('click', (e: any) => {
      e.preventDefault();
      if (e.target.tagName === "A") {
        e.preventDefault();
        const transition = e.target.dataset.transition === "" ? true : false;
        window.history.pushState({}, e.target.pathname, window.location.origin + e.target.pathname);
        this.go(routes, this.parseURI(e.target.pathname), transition);
      }
    })
  }

  /**
   * Allows adding of global application events
   * 
   * @param name Event name.
   * @param method Event method.
   */
  addEvent(name: string, method: Function) {
    this.events.set(name, method);
  }

  /**
   * Fires a global application event.
   * 
   * @param name Event to fire.
   */
  fire(name: string) {
    this.events.get(name);
  }
  
  /**
   * Gets a property value on the application class by key.
   * 
   * @param key Property on application to be accessed.
   */
  get(key: string) {
    return this[key];
  } 

  /**
   * Checks if a component exists by ID.
   * 
   * @param component The component to check.
   */
  has(component: string) {
    return (this.components.get(component)) ? true : false;
  }


  /**
   * Creates a DOM element.
   * 
   * @param elementTagName The element tagname.
   */
  dom(elementTagName: string) {
    return document.createElement(elementTagName);
  }

  /**
   * 
   * Renders the component in the DOM
   * 
   * @param id The component ID to render.
   * @param template The component's template string.
   * @param rerender Condition for render vs. rerender.
   */
  render(id: string, template?: string, rerender?: boolean) {
    if(this.app) {
      const module = this.app.querySelector(`${id}`);
      if (!module && !template)
        this.app.appendChild(this.dom(id))
      if (module && template)
        this.replaceInnerHTML(module, template, rerender);
    }
  }

  /**
   * Helper function to get last item of an array.
   * 
   * @param arr Array to query.
   */
  lastOfArray(arr: Array<string>) {
    return arr[arr.length - 1];
  }

  /**
   * Registers a component in the application.
   * 
   * @param id The component identifier.
   * @param component The component constructor.
   * @param data The data to bind to the registered component.
   * @param transition Tracks whether DOM transitions are on or not.
   */
  component(id: string, component: any, data: any, transition?: boolean) {
    this.currentModule.push(id);
    const componentBuilt = this.has(id),
      helpers = { 
        TEMPLATE_ID: id,
        SOY_PATH: this.soyDir
      }     
    data = Object.assign(data, helpers);
    const module: BaseView = componentBuilt ? this.components.get(id) : new component(data);

    if (this.currentModule && this.lastOfArray(this.currentModule) !== id) 
      this.components.get(this.lastOfArray(this.currentModule)).detach()

    /**
     * Component doesn't exist yet, create it:
     */
    if (!componentBuilt) {
      this.render(id);
      this.components.set(id, module);
    }

    /**
     * Component exists, rerender the template with the new data.
     */

    module.rerender(data, (id: string, template: string, finished?: Function) => {
      this.render(id, template, transition);
      if(finished) finished();
    });
  }
  
  /**
   * 
   * Inserts the new template into the DOM
   * 
   * @param oldDiv The previous component element
   * @param html The new HTML string to append
   * @param transitions Optional css transition support
   */
  replaceInnerHTML(oldDiv: Element, html: string, transitions?: boolean) {
    var newDiv = <HTMLElement>oldDiv.cloneNode(false);
    newDiv.innerHTML = html;
    [...this.app!.children].forEach((page) => {
      console.log(page);
      page.classList.remove('loaded');
      (page as HTMLElement).style.display = 'none';
    })
    if (transitions) {
      const modules = [...this.components.keys()];
      modules.forEach(module => {
        const targ = this.components.get(module);
        const element = this.app!.querySelector(targ.data.TEMPLATE_ID);
        element.style.display = (module !== this.lastOfArray(this.currentModule)) ? 'none' : 'flex';
      });
      newDiv.classList.remove('loaded');
      newDiv.style.opacity = "0";
      newDiv.style.display = 'flex';
      setTimeout(() => {
        newDiv.classList.add('loaded');
      }, 500);
    } else {
      newDiv.classList.remove('loaded');
      newDiv.style.opacity = "1";
      newDiv.style.display = 'flex';
    }
    oldDiv.parentNode!.replaceChild(newDiv, oldDiv);
  }
}

/**
 * Component base logic.
 */
export class BaseView {
  element: HTMLDivElement | null; // DOM reference for the current component
  data: any; // Data binded to the current component
  template: any = null; // Template string for the current component
  key: string; // Components identifier (ie. my-component)

  constructor(data: any, key: string) {
    this.element = null;
    this.data = data;
    this.key = key;
    
    if (data.PARTIAL) {
      this.element = document.querySelector(data.TEMPLATE_ID);
      const template = require(`../../../${this.data.SOY_PATH}/${data.key}.soy`);
      this.element!.innerHTML = template.render(Object.assign({}, { 'payload': data.data }));
    }
  }

  /**
   * Fires after component is rendered.
   */
  protected ready() { }
  
  /**
   * Async function that is fired on render.
   * The returned value is binded to the template.
   */
  protected async load(): Promise<any> { }
  protected detach() {
    document.querySelector(this.data.TEMPLATE_ID).classList.remove('loaded');
  }

  /**
   * Setter and Getter
   */
  get = (key: string) => this.data[key];
  set = (key: string, value: any) => this.data[key] = value;

  /**
   * 
   * Renders the component.
   * 
   * @param key Component identifier.
   * @param item Data to bind.
   * @param callback Callback to fire when finished.
   */
  render(key: string, item: any, callback: Function) {
    if (item) this.template = require(`../../../${this.data.SOY_PATH}/${key}.soy`);
    callback(this.data.TEMPLATE_ID, this.template.render(Object.assign({}, { 'payload': item })));
  }

  /**
   * 
   * Rerender an already built component.
   * 
   * @param binded The new data to bind.
   * @param callback Callback to fire after binded.
   */
  rerender(binded: any, callback: Function) {
    this.data = binded;
    this.load().then((data: any) => {
      this.render(this.key, data, callback);
      this.ready();
    });
  }
}
