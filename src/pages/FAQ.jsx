function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Frequently Asked Questions</h1>
      <p className="mb-6">Find answers to common questions about Cybercode EduLabs.</p>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg">1. What makes Cybercode EduLabs unique?</h2>
          <p className="text-sm">We combine real-world projects, corporate partnerships, and AI-powered learning tools to prepare you for the job market.</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">2. How do I enroll in a course?</h2>
          <p className="text-sm">Simply visit the Courses page, select a program, and click “Register Now.”</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">3. Do I get a certificate?</h2>
          <p className="text-sm">Yes, every course includes a verified experience certificate issued by Cybercode EduLabs.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
