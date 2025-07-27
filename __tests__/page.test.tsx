import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LandingPage from '../app/page'

describe('landing page renders', () => {
    it('landing page renders', () => {
        render(<LandingPage/>);
        expect(screen.getByText("AI-Powered Investment Intelligence")).toBeInTheDocument();
    });

    it('landing video renders', () => {
        render(<LandingPage/>);

        const video = screen.getByTestId("introvid")
        expect(video).toBeInTheDocument();
        
        const source = video.querySelector("source");
        expect(source).toHaveAttribute("src", "/introductionvideo.mp4");
        expect(source).toHaveAttribute("type", "video/mp4");
    })
});