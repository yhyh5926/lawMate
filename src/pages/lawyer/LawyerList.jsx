import { Link } from "react-router-dom";
import { useState } from "react";
import { mockLawyers } from "../../mocks/lawyer/mockLawyers";
import "../../styles/lawyer/lawyerList.css";

export default function LawyerList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(mockLawyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLawyers = mockLawyers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="lawyer-container">
      <h1 className="lawyer-title">변호사 찾기</h1>

      <div className="lawyer-grid">
        {currentLawyers.map((lawyer) => (
          <Link
            to={`/lawyer/${lawyer.id}`}
            key={lawyer.id}
            className="lawyer-link"
          >
            <div className="lawyer-card">
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="lawyer-image"
              />

              <h3 className="lawyer-name">{lawyer.name}</h3>

              <p className="lawyer-specialties">
                전문분야: {lawyer.specialties.join(", ")}
              </p>

              <p className="lawyer-career">경력 {lawyer.careerYears}년</p>

              <p className="lawyer-rating">
                ⭐ {lawyer.rating} ({lawyer.reviewCount})
              </p>

              <p className="lawyer-location">{lawyer.location}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="lawyer-pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`lawyer-page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
