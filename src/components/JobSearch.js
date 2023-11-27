import React, { useState } from 'react';
import axios from 'axios';
import "./JobSearch.css";

const JobSearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/search-jobs', {
                params: { query: searchTerm }
            });
            setJobs(response.data.jobs_results);
            console.log(response.data.jobs_results);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search for jobs"
            />
            <button onClick={fetchJobs} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {jobs && jobs.length > 0 ? (
                        <ul>
                            {jobs.map((job, index) => (
                                <li key={index}>
                                    <h3>{job.title}</h3>
                                    <p>{job.company_name}</p>
                                    <a href={job.link} target="_blank" rel="noopener noreferrer">More Info</a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No jobs found. Try a different search!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearchComponent;
