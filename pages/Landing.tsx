//landing page for the app
import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: ['400'],
    display: 'swap',
    style: 'normal',
    subsets: ['latin'],

});
//Contents:
//1. Logo at top left corner which is DeToxify written in poppins font
//2. a section saying "Detoxify your social media feed in 20 minutes"
//3. a button saying "Get Started" which will take the user to the login page

const Landing = () => {
    return (
        <div style={{ fontFamily: poppins.style.fontFamily,  }}>
            <h1 style={{ letterSpacing: "2px" }}><span style={{ color: "rgb(00,107,255)" }}>De</span>toxify</h1>
            <div style={{ alignItems: 'center', textAlign: 'center', width:"50%", alignSelf:"center" }}>
                <h2>Detoxify your social media feed in 20 minutes</h2>
                <p>
                    DeToxify is a tool that helps you clean up your social media feed by identifying and removing toxic content.
                    Our AI-powered algorithm analyzes your consumption patterns and flags posts that might not be in your best interest.
                    You can then choose to hide or delete these posts, making your feed a safer and more positive place.
                    Try DeToxify today and take control of your social media experience!
                </p>
                <button style={{borderRadius:20, borderColor: "#fff"}}>Get Started</button>
            </div>
        </div>
    );
}

export default Landing;