const InventoryService = (callback = () => {}) => {
    fetch('http://localhost:4300/api/inventory')
        .then(res => res.json())
        .then(callback);
}

export default InventoryService;
