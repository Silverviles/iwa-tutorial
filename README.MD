# Direct Sockets API Tutorial: TCP Server-Client Web App

This project demonstrates how to use the **Direct Sockets API** to create a simple TCP-based web app with both server and client components. The app shows how to establish direct communication between two devices using TCP sockets.

⚠️ **Note:** Direct Sockets API is only available in secure contexts (HTTPS) and requires experimental browser features. Ensure you enable the appropriate browser flags to use it.

---

## **Project Structure**

### **Prerequisites**
- A modern browser with **Direct Sockets API** support (e.g., Chrome Canary)
- Enable the following browser flags:
  1. `chrome://flags/#enable-isolated-web-apps`
  2. `chrome://flags/#enable-direct-sockets`
  3. `chrome://flags/#enable-isolated-web-app-dev-mode`

---

## **Usage Instructions**

### **Step 1: Clone the Repository**
```bash
git clone git@github.com:Silverviles/iwa-tutorial.git

cd direct-sockets-tutorial
```

### **Step 2: Install the necessary node modules**

```bash
npm install
```
### **Step 3: Generate openssl keys(Optional)**

If you are planning to run the web application by installing it as an IWA, then you will need to build the web app into a bundle using vite or webpack. This repository uses vite as the bundler.

Generate an open ssl private key and encrypt that key. If you are on a linux platform, or you have openssl added to your environment, you can execute thee below lines of code inside the project root terminal.

```bash
# Create a directory to keep the certificates
mkdir certs

# Navigate inside the directory
cd certs/

# Generate an openssl private key for signing the bundle
openssl genpkey -algorithm Ed25519 -out private_key.pem

# Encrypt the generated key.  This will ask for a passphrase, make sure to use a strong one
openssl pkcs8 -in private_key.pem -topk8 -out encrypted_key.pem

# Delete the unencrypted key
rm private_key.pem
```

### **Step 4: Generate the bundle**

After generating the signing keys, you can run the below command to generate a signed bundle that you can use to install the IWA.

```bash
npm run build
```

If you added a password when creating the encrypted key(which is a good practice), then it will ask for that password when building the application.

After this command executes, in the project root, you will find a folder named **dist** and inside it will be the project packaged into an **.swbn** file. The name of this file can be changed in the script **vite.config.js** as well as the certificate location when buidling the app as well.

### **Step 5: Install the web application**

Currently, the only way to install the web app is to go to the **chrome://web-app-internals/** url and install it. (You need to enable the relevant flag to access that web page). Once there, you will have 2 options, to install the application using a proxy, or to install the application using a signed web bundle.

To install it as a proxy, the steps 3 and 4 are not required. You can simply execute the below command in the project terminal and add the url to the input field in chrome.

To install it as a .swbn, you must follow steps 1 to 4 correctly and then choose the generated .swbn file to install. This will install the web application as an isolated web app.
