import React, { useState } from 'react';
import axios from 'axios';
import "./JobSearch.css";
import Modal from '@mui/material/Modal';

const JobSearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const handleOpen = (job) => {
      setSelectedJob(job);
      setOpen(true);
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const JobCard = ({ job, onClick }) => {
        return (
            <div className="job-card" onClick={() => onClick(job)}>
                {job.thumbnail ? (
                    <img src={job.thumbnail} alt={job.title} />
                ) : (
                    <div className="company-initial">
                        {job.company_name.charAt(0)}
                    </div>
                )}
            </div>
        );
    };

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
            className="search-input"
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search for jobs"
        />
        <button className = "jobSearchButton" onClick={fetchJobs} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
        </button>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <div className="jobsList">
                {jobs.map((job, index) => (
                    <JobCard key={index} job={job} onClick={handleOpen} />
                ))}
            </div>
        )}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="job-modal-title"
            aria-describedby="job-modal-description"
        >
            <div className="job-modal">
                {selectedJob && (
                <>
                    <h2>{selectedJob.title}</h2>
                    <p><strong>Company:</strong> {selectedJob.company_name}</p>
                    <p><strong>Location:</strong> {selectedJob.location}</p>
                    <p><strong>Via:</strong> {selectedJob.via}</p>
                    <p>{selectedJob.description}</p>
                    {/* Display related_links */}
                    <button className="close_button" onClick={handleClose}>Close</button>
                    <button className="add_button" onClick={handleClose}>Add to Job Description</button>
                </>
                )}
            </div>
        </Modal>
    </div>
    );
};

export default JobSearchComponent;