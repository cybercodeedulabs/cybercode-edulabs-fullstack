import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import courseData from "../data/courseData";
import { useUser } from "../contexts/UserContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificateGenerator() {
  const { courseSlug } = useParams();
  const certificateRef = useRef(null);
  const { user } = useUser();

  const course = courseData.find((c) => c.slug === courseSlug);
  const certificate = {
  image: "/images/certificate-default.png",
  ...(course?.certificate || {})
};
  const studentName = user?.name || "Student";
  const completionDate = new Date().toLocaleDateString("en-IN");
  const certificateId = `${courseSlug.toUpperCase()}-${Date.now()}`;

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${studentName}-certificate.pdf`);
  };

  if (!course) {
    return (
      <div className="p-10 text-center text-red-600">
        <h2 className="text-2xl font-bold">Certificate not found</h2>
        <Link to="/" className="text-indigo-600 underline">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        🎓 Certificate of Completion
      </h2>

      <div className="flex justify-center">
        <div
          ref={certificateRef}
          className="w-[900px] h-[600px] bg-white border-[8px] border-indigo-700 rounded-xl shadow-2xl p-10 text-center relative overflow-hidden"
          style={{
            backgroundImage: `url('${certificate.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* Cybercode Logo */}
          <img
            src="/images/logo.png"
            alt="Cybercode Logo"
            className="h-20 mx-auto mb-2 opacity-95"
          />

          {/* Header Title */}
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
            CYBERCODE EDULABS
          </h1>

          <p className="text-sm tracking-[0.25em] text-gray-600 uppercase mt-1">
            Certificate of Completion
          </p>

          {/* Student Name */}
          <h2 className="mt-10 text-3xl font-bold text-gray-900">{studentName}</h2>
          <p className="text-gray-600 mt-2">has successfully completed</p>

          {/* Course Name */}
          <h3 className="mt-4 text-2xl font-semibold text-indigo-600">
            {course.title}
          </h3>

          {/* Date */}
          <p className="mt-6 text-gray-700">Date: {completionDate}</p>

          {/* Certificate ID */}
          <p className="text-xs mt-1 text-gray-500">
            Certificate ID: {certificateId}
          </p>

          {/* Signature Area */}
          <div className="mt-12 flex justify-center">
            <div className="text-center">
              <img
                src="/images/signature-naren.png"
                className="h-12 mx-auto opacity-90"
                alt="Director Signature"
              />
              <p className="text-sm mt-1 font-semibold">Director</p>
              <p className="text-xs text-gray-500">Cybercode Suite</p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-500">
            This is a system-generated certificate and can be verified using the Certificate ID.
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={downloadCertificate}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
        >
          Download as PDF
        </button>

        <Link
          to={`/courses/${courseSlug}`}
          className="ml-4 underline text-indigo-600 hover:text-indigo-400"
        >
          Back to Course
        </Link>
      </div>
    </div>
  );
}
