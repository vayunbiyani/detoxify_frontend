import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import styles from './HomePage.module.css';  // Importing the CSS module


// Rest of the code...


// Line.register(registerables);

const VideosPerHour = ({ videos_per_hour }: { videos_per_hour: any[] }) => {
    if (!videos_per_hour) {
        return null;
    }
    const hourMap: { [key: number]: string } = {
        0: '12A.M.',
        1: '1A.M.',
        2: '2A.M.',
        3: '3A.M.',
        4: '4A.M.',
        5: '5A.M.',
        6: '6A.M.',
        7: '7A.M.',
        8: '8A.M.',
        9: '9A.M.',
        10: '10A.M.',
        11: '11A.M.',
        12: '12P.M.',
        13: '1P.M.',
        14: '2P.M.',
        15: '3P.M.',
        16: '4P.M.',
        17: '5P.M.',
        18: '6P.M.',
        19: '7P.M.',
        20: '8P.M.',
        21: '9P.M.',
        22: '10P.M.',
        23: '11P.M.',
    };

    return (
        <div className={styles.dashboardSection}>
            <h2>Average videos around the day</h2>
            <ul className={styles.dashboardList}>
                {videos_per_hour.map((hour: any, index: number) => (
                    <li key={index}>
                        <span className={styles.hour}>{hourMap[hour.hour] + " "}</span>
                        <span className={styles.count}>{hour.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
const TopChannels = ({ top_channels, abstainChannels, setAbstainChannels }: {
    top_channels: any[],
    abstainChannels: string[],
    setAbstainChannels: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    if (!top_channels) {
        return null;
    }
    const handleCheckboxChange = (channel: string) => {
        if (abstainChannels.includes(channel)) {
            setAbstainChannels(abstainChannels.filter((c) => c !== channel));
        } else {
            setAbstainChannels([...abstainChannels, channel]);
        }
    };

    return (
        <div className={styles.dashboardSection}>
            <h2>Most commonly browsed channels</h2>
            <ul className={styles.dashboardList}>
                {top_channels.map((channel: any, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={abstainChannels.includes(channel.channel_title)}
                            onChange={() => handleCheckboxChange(channel.channel_title)}
                        />
                        <span className={styles.channel}>{channel.channel_title}{" "}</span>
                        <span className={styles.count}>{channel.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CommonProperNouns = ({ common_proper_nouns, abstainNouns, setAbstainNouns }: {
    common_proper_nouns: any[],
    abstainNouns: string[],
    setAbstainNouns: React.Dispatch<React.SetStateAction<string[]>>
}) => {

    if (!common_proper_nouns) {
        return null;
    }
    const handleCheckboxChange = (noun: string) => {
        if (abstainNouns.includes(noun)) {
            setAbstainNouns(abstainNouns.filter((n) => n !== noun));
        } else {
            setAbstainNouns([...abstainNouns, noun]);
        }
    };


    return (
        <div className={styles.dashboardSection}>
            <h2>You have watched most content on: </h2>
            <ul className={styles.dashboardList}>
                {common_proper_nouns.map((noun: any, index: number) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={abstainNouns.includes(noun.proper_noun)}
                            onChange={() => handleCheckboxChange(noun.proper_noun)}
                        />
                        <span className={styles.noun}>{noun.proper_noun}{" "}</span>
                        {/* <span className={styles.count}>{noun.weighted_count}</span> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
const VideosPerWeekChart = ({ videos_per_week }: { videos_per_week: any[] }) => {
    return (
        <div className={styles.chartContainer}>
            <h2>Videos per Week</h2>
            <LineChart width={500} height={300} data={videos_per_week}>
                <XAxis dataKey="week_start" />
                <YAxis dataKey="count" />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};

const RenderDashboard = ({ dashboardData, abstainChannels, setAbstainChannels, abstainNouns, setAbstainNouns }: {
    dashboardData: any,
    abstainChannels: string[],
    setAbstainChannels: React.Dispatch<React.SetStateAction<string[]>>,
    abstainNouns: string[],
    setAbstainNouns: React.Dispatch<React.SetStateAction<string[]>>
    detoxifyButtonHandler: any
}) => {
    console.log("RenderDashboard");
    if (!dashboardData) {
        return null;
    }

    const detoxifyButtonHandler = () => {
        const abstainNounsString = JSON.stringify(abstainNouns);
        const abstainChannelsString = JSON.stringify(abstainChannels);
        window.postMessage({
            type: 'SET_DATA',
            abstainNouns,
            abstainChannels
        }, '*');

        console.log("Detoxify button  ")
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    const videos_per_week_data = dashboardData.videos_per_week ? dashboardData.videos_per_week.map((item: any) =>
        ({ ...item, week_start: formatDate(item.week_start) })
    ) : [];


    const { common_proper_nouns, top_channels, videos_per_hour, videos_per_week } = dashboardData;

    return (
        <div className={styles.dashboardSection}>

            <CommonProperNouns common_proper_nouns={common_proper_nouns}
                abstainNouns={abstainNouns}
                setAbstainNouns={setAbstainNouns}
            />

            <TopChannels top_channels={top_channels}
                abstainChannels={abstainChannels}
                setAbstainChannels={setAbstainChannels}
            />

            <button onClick={() => { detoxifyButtonHandler() }}>Detoxify</button>

            <VideosPerHour videos_per_hour={videos_per_hour} />

            <VideosPerWeekChart videos_per_week={videos_per_week_data} />

        </div>
    );
};

const HomePage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [dashboardData, setDashboardData] = useState<any>();
    const [abstainChannels, setAbstainChannels] = useState<string[]>([]);
    const [abstainNouns, setAbstainNouns] = useState<string[]>([]);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async (endpoint: string) => {
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://3.108.4.128:8080${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setDashboardData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const quotes = [
        "Waiting for this file to upload is like watching paint dry... on a glacier... during a snowstorm.",
        "I could write a novel in the time this file is taking to upload. And it would be a trilogy.",
        "Waiting for this file to upload: the perfect time to reflect on my life choices... like why I didn’t compress this file.",
        "Just uploaded a huge file. Meanwhile, the dinosaurs evolved and went extinct again.",
        "If I had a dollar for every second I’ve waited for this upload, I could buy faster internet.",
        "I swear, by the time this upload is done, my grandkids will be wondering what the internet was.",
        "Uploading this file is like waiting for the next season of my favorite show... infinite cliffhanger.",
        "At this rate, I’m going to grow a beard waiting for this file to upload. And I'm not even capable of growing a beard.",
        "I think I just saw a snail overtake my upload progress.",
        "Uploading this file feels like waiting for a text back from someone who promised to respond ‘soon.’"
    ];

    const renderQuote = () => {
        if (quoteIndex >= quotes.length) {
            return null;
        }

        return (
            <div className={styles.loadingQuote}>
                <h1>Loading...</h1>
                <h2>This may take up to five minutes</h2>
                <h3>{quotes[quoteIndex]}</h3>
            </div>
        );
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isLoading) {
            interval = setInterval(() => {
                setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
            }, 5000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isLoading]);

    useEffect(() => {
        const foo = () => {

            console.log("foo");

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            document.body.appendChild(script);

            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
            document.body.appendChild(script2);

            script2.onload = () => {
                const script3 = document.createElement('script');
                script3.innerHTML = `
                VANTA.NET({
                    el: "body",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0xa168b9,
                    backgroundColor: 0x20002,
                    points: 14.00,
                    maxDistance: 24.00,
                    spacing: 13.00
                });
            `;
                document.body.appendChild(script3);

                return () => {
                    document.body.removeChild(script);
                    document.body.removeChild(script2);
                    document.body.removeChild(script3);
                };
            };
        };
        foo();
    }, []);


    console.log("rendered");

    if (!isClient) {
        return null; // or a loading spinner, or some placeholder
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Upload YouTube Analytics File</h1>
            <input className={styles.fileInput} type="file" onChange={handleFileChange} />
            <div>
                <button className={styles.button} onClick={() => handleUpload('metrics')}>Get Metrics</button>
            </div>
            {isLoading && renderQuote()}
            {dashboardData && <RenderDashboard dashboardData={dashboardData}
                abstainChannels={abstainChannels}
                setAbstainChannels={setAbstainChannels}
                abstainNouns={abstainNouns}
                setAbstainNouns={setAbstainNouns}
            />}
        </div>
    );
};

export default HomePage;

