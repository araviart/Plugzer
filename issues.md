# Task list of the API requirements : 

## Requests required : 

### Post Requests :

- [ ] Post request to sign up. 
- [ ] Post request to log in.
- [ ] Post request to save a book.
- [ ] Post request to rate a specific book.

###  Get Requests :

- [ ] Get request to see every book from the library.
- [ ] Get request to see a single book.
- [ ] Get request to see the best rated book from the library.


### PUT Request :

- [ ] Put request to modify the informations of a book.

### Delete Request : 

- [ ] Delete request to erase the book and the associated image.

### Error handling : 

- Errors must be sent back exactly as they are without any modification. If necessary, use a new "Error()".

### API Routes :

- Every routes associated with books must require an authentification, to only allow the owner of the book to modify it. If the user_id is wrong send a "403: Unauthorized request" error message.

### Models : 

- Users model must contain : 
  - email: string   - It must be unique
  - password: string    - crypted password

- Books model must contain : 
  - userId: string    - Unique MongoDB Id from the creator/owner of the book
  - title: string     - title of the book
  - author: string
  - imageUrl: string
  - year: number
  - genre: string
  - ratings: [{userID: string; grade: number}]    - Unique MongoDB id from the person who rated the book / rating given to the book
  - averageRating: number     -average note of the book


### Security :

- password must be hashed.
- authentication must be reinforced over every book routes.
- emails contained in the database must be unique and a mongoose plugin must be used to garanty it.
- The security of the MongoDB database must allow users to launch it on a user's computer.
- Database errors must be sent back.