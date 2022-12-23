# Software Requirements

1. What is the vision of this product?
  - A backend application that allows customers to shop a wide variety of plants, and communicate with plant professional to learn what plant is best for them and how to care for it.

2. What pain point does this project solve?
  - The help of a knowledgeable plant professional to help you pick the best plant for your home/garden
  - The help of a knowledgeable plant professional to help you best care for your new plant
  - All the plant varieties you can possibly think of, available to purchase
  - Convenience of having a plant delivered to your doorstep
  
3. Why should we care about your product?
  - The help of a knowledgeable plant professional to help you pick the best plant for your home/garden
  - The help of a knowledgeable plant professional to help you best care for your new plant
  - All the plant varieties you can possibly think of, available to purchase
  - Convenience of having a plant delivered to your doorstep
  
## Scope (In/Out)

1. IN - What will your product do

  - Admin that can see all users, and create, update or delete plants in the collection
  - Customer can login
  - Customer can search for/browse all plants
  - Admin can add or delete, or update items on the website
  - Customer can add or delete, or update items in their shopping cart
  - Customer can chat with botanists (plant nurse) about plant care

  - **Stretch goals**
    - Plant care items
    - Search for plants by location (User can input their location and find plants that are best suited for the climate of their region)
    - User can add items to their favorites
    - User can purchase and order items to be delivered
    - User can return items
  
2. OUT - What will your product not do.
  - Our product will never unethically source items to sell
  
## Minimum Viable Product

1. What will your MVP functionality be?

Authentication and Authorization:
Admin that can see all users, and create, update or delete plants in the collection
Customer can login

Create in house API and/or plant API):
Customer can search for/browse all plants

Full CRUD operations:
Customer can add or delete, or update items in their shopping cart

Message Client using sockets and queue:
Customer can chat with botanists (plant nurse) about plant care

Deployed on AWS

Unit tests for each features

2. What are your stretch goals?

Stretch goals
Plant care items
Search for plants by location (User can input their location and find plants that are best suited for the climate of their region)
User can add items to their favorites
User can purchase and order items to be delivered
User can return items

## Functional Requirements
List the functionality of your product. This will consist of tasks such as the following:

  - Admin that can see all users, and create, update or delete plants in the collection
  - Customer can login
  - Customer can search for/browse all plants
  - Admin can add or delete, or update items on the website
  - Customer can add or delete, or update items in their shopping cart
  - Customer can chat with botanists (plant nurse) about plant care

## Data Flow
Describe the flow of data in your application. Write out what happens from the time the user begins using the app to the time the user is done with the app. Think about the “Happy Path” of the application. Describe through visuals and text what requests are made, and what data is processed, in addition to any other details about how the user moves through the site.

- User creates an account
- User logs in
- If user is a customer:
  - User can shop and view, add, update, or delete items in their shopping cart
  - User can "checkout"
- If user is an admin:
  - User can view, create, update, and delete items in the plant collection
- At anytime after login, user can chat with an admin about plants in a message service

## Non-Functional Requirements
Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.

1. Security
  - Security matters because customers should not be able to do anything with items in the plant collection on the main page, except read and add.
2. Usability
  - Clean, DRY code that fosters a simple data flow and functionality
3. Maintainability
  - Developing a modularized, well commented environment that everyone on the team understands

