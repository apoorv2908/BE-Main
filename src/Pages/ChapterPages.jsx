import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Styles/ChapterPages.css";
import config from "../config";

const ChapterPages = () => {
  const { chapter_id } = useParams();
  const history = useNavigate();
  const [chapterTitle, setChapterTitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [pages, setPages] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/home/fetchchapterpages.php?chapter_id=${chapter_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setChapterTitle(data[0].chapter_name);
          setBookTitle(data[0].book_name);
          setPages(data);
        }
      })
      .catch((error) => console.error("Error fetching chapter pages:", error));
  }, [chapter_id]);

  useEffect(() => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/home/fetchResources.php?chapter_id=${chapter_id}`
    )
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error("Error fetching resources:", error));
  }, [chapter_id]);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFullView = () => {
    const fullViewUrl = `${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_pages/${pages[currentPage].image_path}`;
    window.open(fullViewUrl, "_blank");
  };

  const handleShareChapter = () => {
    const shareUrl = window.location.href;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => alert("URL copied to clipboard!"))
      .catch((err) => console.error("Failed to copy the URL: ", err));
  };

  const renderResourcesTable = (type) => {
    const filteredResources = resources.filter(
      (resource) => resource.resource_type === type
    );

    if (filteredResources.length === 0) {
      return (
        <div className="no-resources">
          No resources available for this type.
        </div>
      );
    }

    return (
      <div className="resource-table-container">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Files</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.resource_id}>
                <td>
                  {/* Files Column */}
                  {type === "videos" && resource.video_file && (
                    <div>
                      <video className="resource-video" controls>
                        <source
                          src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/videos/${resource.video_file}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}
                  {type === "documents" && resource.document_file && (
                    <div>
                      <a
                        href={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/documents/${resource.document_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {type === "audio" && resource.audio_file && (
                    <div>
                      <audio className="resource-audio" controls>
                        <source
                          src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/audios/${resource.audio_file}`}
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  )}
                  {type === "interactivities" &&
                    resource.interactivities_file && (
                      <div>
                        <a
                          href={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/interactivities/${resource.interactivities_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          Interactive Activity
                        </a>
                      </div>
                    )}
                  {type === "addnactivities" &&
                    resource.addnactivities_file && (
                      <div>
                        <a
                          href={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/addnactivities/${resource.addnactivities_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          Additional Activity
                        </a>
                      </div>
                    )}
                  {type === "answerkeys" && resource.answerkeys_file && (
                    <div>
                      <a
                        href={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/answerkeys/${resource.answerkeys_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        Answer Key
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="resource-table">
          <thead>
            <tr>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.resource_id}>
                <td>
                  {/* Links Column */}
                  {type === "videos" && resource.video_link && (
                    <a
                      href={resource.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      {resource.video_link}{" "}
                    </a>
                  )}
                  {type === "documents" && resource.document_link && (
                    <a
                      href={resource.document_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      External Document Link
                    </a>
                  )}
                  {type === "audio" && resource.audio_link && (
                    <a
                      href={resource.audio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      Listen to Audio
                    </a>
                  )}
                  {type === "interactivities" &&
                    resource.interactivities_link && (
                      <a
                        href={resource.interactivities_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        External Interactivity
                      </a>
                    )}
                  {type === "addnactivities" &&
                    resource.addnactivities_link && (
                      <a
                        href={resource.addnactivities_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        External Additional Activity
                      </a>
                    )}
                  {type === "answerkeys" && resource.answerkeys_link && (
                    <a
                      href={resource.answerkeys_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      External Answer Key
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="py-2">
      <div
        className="p-3 h3 mx-3 fw-bold text-uppercase"
        style={{
          background: "linear-gradient(to right, #192152, white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        {bookTitle} <br />
        <span className="h6"> - {chapterTitle}</span>
      </div>

      <div className="d-flex justify-content-end fs-4" style={{ gap: "20px" }}>
        <i className="bi bi-chevron-double-left" onClick={handlePrevPage}></i>
        <i className="bi bi-chevron-double-right" onClick={handleNextPage}></i>
        <i className="mx-3 bi bi-fullscreen" onClick={handleFullView}></i>
        <i className="bi bi-share-fill mx-3" onClick={handleShareChapter}></i>
      </div>
      <hr />

      <div className="page-navigation-container p-3">
        <div className="page-content">
          {pages.length > 0 ? (
            <div
              className="border"
              style={{ boxShadow: "0px 0px 7px lightgrey" }}
            >
              <img
                src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_pages/${pages[currentPage].image_path}`}
                alt={`Page ${currentPage + 1}`}
                className="page-image p-3"
              />
            </div>
          ) : (
            <div className="no-pages-found">No pages found</div>
          )}
        </div>
      </div>

      {/* Tabs for resources */}
      <div className="px-5 mt-5 resources-container">
        <h3>Resources for this Chapter</h3>
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`tab-button ${activeTab === "audio" ? "active" : ""}`}
            onClick={() => setActiveTab("audio")}
          >
            Audio
          </button>
          <button
            className={`tab-button ${
              activeTab === "documents" ? "active" : ""
            }`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </button>
          <button
            className={`tab-button ${
              activeTab === "interactivities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("interactivities")}
          >
            Interactivities
          </button>
          <button
            className={`tab-button ${
              activeTab === "addnactivities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("addnactivities")}
          >
            Additional Activities
          </button>
          <button
            className={`tab-button ${
              activeTab === "answerkeys" ? "active" : ""
            }`}
            onClick={() => setActiveTab("answerkeys")}
          >
            Answer Keys
          </button>
        </div>

        <div className="tab-content mt-4">
          {renderResourcesTable(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default ChapterPages;
