
# Checkout Builder+

## SDK Description

This project aims to simplify the Merchant’s experience when implementing the SDK within their projects, allowing greater flexibility when customizing the checkout. It is designed to be intuitive, fast, and easy to use, leveraging NextJS and React components to provide time-saving benefits for both the Merchant and Yuno.

At a high level, the system allows the integration and creation of highly customizable Checkouts that offer a wide range of options, enabling each Merchant to adapt our libraries to their needs and styles, while preserving their brand identity through Yuno’s tools.

----------

## How to Run the Project

### Prerequisites

- **Language / Runtime:** [Node.js]  
- **Minimum version:** [Bun@latest]  
- **Additional tools:** [npm, pnpm, yarn, bun]

### Steps to Execute

1. Install the SDK:

    ```bash
    npm install yuno-sdk-checkout-builder
    ```

2. Use the authentication token with Yuno:

    ```bash
    SDK.getStyle("<your-token>")
    ```

3. Render the component:

    ```bash
    SDK.Render()
    ```

4. Use payment endpoints:

    ```bash
    SDK.startPayment()
    //...
    SDK.checkStatus()
    ```

----------
## 📁 Repository Structure

The project is organized following a modular structure that enables better scalability, maintainability, and separation of concerns. Below is a description of the purpose of each main folder:

```bash
demo-yuno/                     # Main source code of the project
├── apps/                      # Functional applications involved in the overall workflow
│   ├── backend/demoYuno       # Mocked backend that simulates Yuno services, maintains an in-memory database, and exposes endpoints to execute a payment flow (payment initiation, token validation), mantain a layered architecture between (Controller -> Service -> Repository* -> Entity), made in Java Spring Boot
│   ├── website-docs/          # Documentation related to the SDK and the website, providing extended information about each component
│   └── website/               # Web application that centralizes the checkout creation process using a drag-and-drop approach, leveraging AI for prompting and web scraping, the architecture of this project it's oriented to components
├── packages/                  # Package that centralizes the layers of the developed SDK
│   ├── yuno-demo-sdk-ui/      # Presentation layer that consumes a client-specific configuration JSON (associated with its API key) to preload the appearance of the checkout created on the website
│   └── yuno-demo-sdk/         # Business logic / service layer that connects to the API (backend/demoYuno) through predefined methods
├── Component Diagram          # Component diagram illustrating communication and architecture between components
└── Use Case Diagram           # Use case diagram illustrating how the SDK can be integrated within the Yuno ecosystem
```
 
----------



## Key Technical Decisions

- **Architecture:** A layered architecture was chosen, where each layer has a well-defined responsibility. This separation of concerns enables future scalability without requiring changes to existing components.

- **Language and framework:** TypeScript and the NextJS framework were used, along with the generation of React components, due to the wide availability of libraries that accelerate development and complement the offered functionalities, as well as the team’s expertise with these technologies.

- **Dependency management:** npm and bun were used to ensure security and proper version management.

- **Other relevant decisions:**
  
  - **Bucket selection for JSON config storage:** This allows greater flexibility within the project and provides faster, direct access to the resource for loading the JSON configuration.
  
  - **Use of an iFrame (not implemented but considered) in the form:** For security reasons, no Merchant should have direct access to the generated components. Instead, access would be provided through an iFrame, preventing exposure to sensitive fields such as card numbers.

----------

## Additional Notes

- This project is currently a PoC or early prototype that showcases the main vision and immediate goals, with opportunities for growth and improvement based on the current solution.

- Future improvements include enhanced security, new features related to the Checkout Builder, and additional AI-driven implementations at different stages of the lifecycle.

## URL's
- Website (landing page, Checkout Builder, AI Builder, Web Scrapper) : https://yuno.uprizing.me/
- Website Docs : https://docs.yuno.uprizing.me/docs
- Demo Project : https://prototypeyuno.netlify.app/ 
