describe("Log In", () => {
    const user = cy;
    it("should see login page", () => {
        user.visit("/").title().should("eq", "Login | Uber Eats");
    });
    it("Can see email / password validation errors", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i)
            .type("happy@email")
        user.findByRole("alert")
            .should("have.text", "Please enter a valid email");
        user.findByPlaceholderText(/email/i).clear();
        user.findByRole("alert").should("have.text", "Email is required");
        user.findByPlaceholderText(/email/i).type("happy@email.com");
        user.findByPlaceholderText(/password/i).type("a").clear();
        user.findByRole("alert").should("have.text", "Password is required");
    });
    it("can fill out the form and log in", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i)
            .type("happy@gmail.com")
        user.findByPlaceholderText(/password/i)
            .type("1234")
        user.findByRole("button")
            .should("not.have.class", "pointer-events-none").click();
        user.window().its("localStorage.uber-token").should("be.a", "string");
    });
});