package noahs.ark.noahs_ark;

import com.google.api.core.ApiFuture;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.*;
import static spark.Spark.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

import java.io.FileInputStream;
import java.io.InputStream;
import java.time.Instant;

class CustomerObj {
	String id;
	Map <String, Object> data;
	
	CustomerObj(String id, Map<String, Object> data) {
		this.id = id;
		this.data = data;
	}
}

class RequestBody {
	String firstName;
	String lastName;
	String company;
	String email;
	String enrolledAt;

	int age;
	
	RequestBody(
			String firstName, 
			String lastName, 
			String company, 
			String email, 
			String enrolledAt,
			int age) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.company = company;
		this.email = email;
		this.enrolledAt = enrolledAt;
		this.age = age;
	}
	
	String getFirstName() {
		return this.firstName;
	}
	
	String getLastName() {
		return this.lastName;
	}
	
	int getAge() {
		return this.age;
	}
	
	String getCompany() {
		return this.company;
	}
	
	String getEnrolledAt() {
		return this.enrolledAt;
	}
	
	String getEmail() {
		return this.email;
	}
}

public class App {
	
    public static void main(String[] args) throws ExecutionException, Throwable {
    	InputStream serviceAccount = new FileInputStream("C:/Users/Noah/eclipse-workspace/java-customer-api/java-api-db08e-firebase-adminsdk-5b1qb-66a18ac44e.json");
		GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
		FirebaseOptions options = new FirebaseOptions.Builder()
		    .setCredentials(credentials)
		    .build();
		FirebaseApp.initializeApp(options);
		Firestore db = FirestoreClient.getFirestore();

		/**
		 * ADD a new customer.
		 */
		post("/customers/add", (request, response) -> {
			Map<String, Object> data = new HashMap<>();
			DocumentReference newDoc = db.collection("customers").document();
			Gson gson = new Gson();
			ObjectMapper oMapper = new ObjectMapper();
			oMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			RequestBody requestBody = gson.fromJson(request.body(), RequestBody.class);
	        data.put("firstName", requestBody.getFirstName());
	        data.put("lastName", requestBody.getLastName());
	        data.put("email", requestBody.getEmail());
	        data.put("age", requestBody.getAge());
	        data.put("company", requestBody.getCompany());
	        data.put("enrolledAt", Instant.now().toString());
	        ApiFuture<WriteResult> result = newDoc.set(data);
	        System.out.println("Update time : " + result.get().getUpdateTime());
	        return "User Added with ID: " + newDoc.getId();
		});
		
		/**
		 * UPDATE a customer by ID.
		 */
		put("/customers/update/:id", (request, response) -> {
			Map<String, Object> data = new HashMap<>();
			String id = request.params("id");
			DocumentReference updatedoc = db.collection("customers").document(id);
			Gson gson = new Gson();
			ObjectMapper oMapper = new ObjectMapper();
			oMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			RequestBody requestBody = gson.fromJson(request.body(), RequestBody.class);
	        data.put("firstName", requestBody.getFirstName());
	        data.put("lastName", requestBody.getLastName());
	        data.put("email", requestBody.getEmail());
	        data.put("age", requestBody.getAge());
	        data.put("company", requestBody.getCompany());
	        ApiFuture<WriteResult> result = updatedoc.set(data);
	        return "User ID updated with: " + result.get().toString();
		});
		
		/**
    	 * GET all customers.
    	 */
    	get("/customers", (req, res) -> {
    		CountDownLatch done = new CountDownLatch(1);
    		ApiFuture<QuerySnapshot> query = db.collection("customers").get();
    		
    		QuerySnapshot querySnapshot = query.get();
    		List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
    		
    		int i = 0;
    		
    		List<CustomerObj> docList = new ArrayList<CustomerObj>();
    		
    		for (QueryDocumentSnapshot document : documents) {
    			CustomerObj customerObj = new CustomerObj(document.getId(), document.getData());
    			docList.add(customerObj);
    			i++;
    			
    			if(i == documents.toArray().length) {
    				done.countDown();
    			}
    		}
    		
    		Gson gson = new Gson();
    		String json = gson.toJson(docList);
    		
    		done.await();
    		return json;
    	});
    	
    	/**
    	 * GET a singular customer by ID.
    	 */
        get("/customers/:id", (req, res) -> {
        	CountDownLatch done = new CountDownLatch(1);
        	String id = req.params("id");
        	CustomerObj customerObj = null;
        	Gson gson = new Gson();
        	
        	DocumentReference docRef = db.collection("customers").document(id);
        	ApiFuture<DocumentSnapshot> future = docRef.get();
        	DocumentSnapshot document = future.get();
        	
        	if (document.exists()) {
        	  customerObj = new CustomerObj(id, document.getData());
        	  done.countDown();
        	}
        	
        	done.await();
    		return gson.toJson(customerObj);
        });
        
        delete("/customers/delete/:id", (req, res) -> {
        	String id = req.params("id");
        	db.collection("customers")
        	  .document(id)
        	  .delete();
        	return "Customer #" + id + " deleted.";
        });
		
		/**
		 * API options.
		 */
    	options("/*",
    	        (request, response) -> {
    	            String accessControlRequestHeaders = request
    	                    .headers("Access-Control-Request-Headers");
    	            if (accessControlRequestHeaders != null) {
    	                response.header("Access-Control-Allow-Headers",
    	                        accessControlRequestHeaders);
    	            }

    	            String accessControlRequestMethod = request
    	                    .headers("Access-Control-Request-Method");
    	            if (accessControlRequestMethod != null) {
    	                response.header("Access-Control-Allow-Methods",
    	                        accessControlRequestMethod);
    	            }
    	            return "OK";
    	        });
    	before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
    }
}
