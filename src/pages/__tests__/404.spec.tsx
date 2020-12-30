import { waitFor } from "@testing-library/react"
import { render } from '../../test-utils';

import { NotFound } from "../404"


describe("NotFount", () => {
    it("renders OK", async () => {
        render(<NotFound />);
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Ubeer Eats");
        });
    });
});