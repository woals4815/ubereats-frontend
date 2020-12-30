import { render, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import { NotFound } from "../404"


describe("NotFount", () => {
    it("renders OK", async () => {
        render(
            <HelmetProvider>
                <Router>
                    <NotFound />
                </Router>
            </HelmetProvider>
        );
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Ubeer Eats");
        });
    });
});