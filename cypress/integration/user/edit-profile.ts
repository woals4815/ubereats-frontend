describe("Edit profile", () => {
    const user = cy;
    beforeEach(() => {
        //@ts-ignore
        user.login("holy@gmail.com", "1234");
    });
    it("Can go to /edit-profile using the header", () => {
        user.get('a[href="/edit-profile"]').click();
        user.wait(2000);
        user.title().should("eq", "Edit Profile | Uber Eats");
    });
    it("Can change Email", () => {
        user.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if (req.body?.operationName === "editProfile") {
                //@ts-ignore
                req.body?.variables?.input?.email = "holy@gmail.com"
            }
        })
        user.visit("/edit-profile");
        user.findByPlaceholderText(/email/i).clear().type("happy@gmail.com");
        user.findByRole("button").click();
    })
})