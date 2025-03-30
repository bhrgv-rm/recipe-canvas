# Recipe Canvas

- An app made for users to add their own recipes to the web, with all the specifications needed.
- Users can access recipes created by any user.
- Users are authenticated using [NextAuth](https://authjs.dev/reference/nextjs) and all the information is stored in a PostgreSQL database.
- Database transactions work with the help of [Prisma ORM](http://prisma.io/) which simplifies the processes.

Below is the image of the PostgreSQL tables that are used to create the database.
![](/schema.png)

---

### To-Dos

- [ ] Allow users to download macros of recipes as images.
- [ ] Use Cloudinary to reduce image loading speeds.
- [ ] Add a page for recipe suggestions based on the ingredients given.
- [ ] Advanced search feature for searching users and recipes.
- [ ] Finish the ratings feature for a recipe.
