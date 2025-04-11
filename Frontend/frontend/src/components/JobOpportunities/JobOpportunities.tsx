import React from 'react';

const JobOpportunities = () => {
  const jobs = [
    {
      title: 'Software Engineer Intern',
      company: 'Google',
      desc: 'Join our team to work on cutting-edge technology projects and make a real impact.',
      deadline: 'Apr 30, 2024',
    },
    {
      title: 'Cloud Developer Intern',
      company: 'Microsoft',
      desc: 'Work with Azure cloud services and help build the future of cloud computing.',
      deadline: 'May 15, 2024',
    },
    {
      title: 'AI Research Intern',
      company: 'Meta',
      desc: 'Research and develop next-generation AI solutions for social connectivity.',
      deadline: 'May 30, 2024',
    }
  ];

  return (
    <section className="py-16 px-8 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center">Job & Internship Opportunities</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map((job, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-bold text-xl mb-2">{job.title}</h3>
            <p className="text-[#FF6B00] mb-1">{job.company}</p>
            <p className="text-gray-600 text-sm mb-4">{job.desc}</p>
            <p className="text-sm text-gray-500 mb-3">Deadline: {job.deadline}</p>
            <button className="text-white bg-[#0CCE6B] px-4 py-2 rounded-md">Apply Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobOpportunities;
