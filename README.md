OVERVIEW

This Journal App is a role-based journal logging backend app for teachers and students. Teachers can create journals and tag students. 
Students can view journals they’re tagged in. Moreover, it provides a smooth backend execution process where teacher and student execute
requests like get, put, create journal, update journal in their respective teacher and student feeds. Creating and updating journals is 
allowed only for teachers and not for students.Similarly, only students can access their feed and teachers can’t.

Overall, this protected REST API integration aims towards leveraging Postman Collection for
directly executing these requests on a render-hosted URL.

[image](https://github.com/user-attachments/assets/0786555a-25fd-4437-83ed-a0bf5cf47455)

EXPLANATION OF AUTHENTICATION:

The JWT token received as shown in Fig. 1 confirms the identity of the user (teacher or
student). When we include the token in the Authorization Header, the server can decode it to
know who the user is, as shown in Fig. 2:

![image](https://github.com/user-attachments/assets/2aebc4ed-00df-436d-b49d-8d9da0d2bd9d)

AUTHORIZATION:

It determines what the authenticated user is allowed to do:
● Teachers can create, update and delete journals.
● Students can only view journals they are tagged in.

ENTITY-RELATIONSHIP (ER) DIAGRAM:

![image](https://github.com/user-attachments/assets/bc5e6a98-c52c-40b9-937d-04af52c24d0a)

Entities:
1. User Table: Stores both teacher and student accounts.
2. Journal_students Table: Stores journal entries created by teachers.
3. Journal_students Table: Many to many join table linking students to journals they are
tagged in.

Relationships:
1. One-to-Many:
● One teacher can create many journals.
● Relationship between users.id and journals.teachers_id
2. Many-to-Many:
● A journal can be tagged with multiple students, and a student can be tagged in
multiple journals.
● Implemented via journal_students table linking jurnals_id and student_id.

ACCESS PROTECTED ROUTES:

Various routes involved like /journal, /feed/teacher, /protected/test require a valid token that is
checked and verified by the middleware before allowing access. Therefore, the JWT token is
attached with the specific request to prove user identity and access role-based endpoints
securely.
Requests executed and response delivered are demonstrated in the following figures in
Postman Collection:

![image](https://github.com/user-attachments/assets/eef8e5bd-4e19-4fb0-baee-3c2b55f2f326)

![image](https://github.com/user-attachments/assets/fa40838e-2f8a-479a-a98a-e1f947b0b49a)

![image](https://github.com/user-attachments/assets/42a05484-1fbd-42c1-9494-edc9897c04de)

![image](https://github.com/user-attachments/assets/7972a849-3f06-470f-91c1-6cb776ad8ea5)


CONCLUSION:

The Toddle Journal API is a robust, role-based microservice built with Node.js and Express.
It demonstrates the implementation of a secure authentication system using JSON Web
Tokens (JWT) and provides a comprehensive set of REST endpoints that allow teachers to
manage classroom journals and students to view journals in which they are tagged.


