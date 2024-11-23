import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/ChapterPages.css';
import config from "../config";

const MybookChapterpages = () => {
  const { chapter_id } = useParams();
  const history = useNavigate();
  const [chapterTitle, setChapterTitle] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [pages, setPages] = useState([]);
  const [resources, setResources] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/fullmarks-user/home/fetchchapterpages.php?chapter_id=${chapter_id}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setChapterTitle(data[0].chapter_name);
          setBookTitle(data[0].book_name);
          setPages(data);
        }
      })
      .catch(error => console.error('Error fetching chapter pages:', error));
  }, [chapter_id]);

  useEffect(() => {
    // Fetching resources for the chapter
    fetch(`${config.apiBaseUrl}/fullmarks-user/home/fetchResources.php?chapter_id=${chapter_id}`)
      .then(response => response.json())
      .then(data => setResources(data))
      .catch(error => console.error('Error fetching resources:', error));
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
    window.open(fullViewUrl, '_blank');
  };

  const handleShareChapter = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('URL copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy the URL: ', err);
    });
  };

  const renderResources = (type, label) => {
    const filteredResources = resources.filter(resource => resource.resource_type === type);
    if (filteredResources.length === 0) return null;

    return (
      <div>
        <div className="p-2 mb-4 bg-warning h5">{label}:</div>
        {filteredResources.map(resource => (
          <div key={resource.resource_id}>
            {type === 'videos' && (
              <video className="zampa" controls>
                <source
                  src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/videos/${resource.video_file}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
            
            {type === 'documents' && (
              <div className="zampa" controls>
                <source
                  src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/documents/${resource.documents_file}`}
                />
              </div>
            )}

{type === 'audio' && (
              <div className="zampa" controls>
                <source
                  src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/audios/${resource.audio_file}`}
                />
              </div>
            )}

{type === 'interactivities' && (
              <div className="zampa" controls>
                <source
                  src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/interactivities/${resource.interactivities_file}`}
                />
              </div>
            )}


{type === 'addnactivities' && (
              <div className="zampa" controls>
                <source
                  src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/addnactivities/${resource.addnactivities_file}`}
                />
              </div>
            )}

            
           
            <div className="mb-3 fw-bold">{resource.resource_title}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-5">
      <div className='border diskcha'>
        <p className='text-center h2 mt-4 text-uppercase fw-bold text-white'>
          {bookTitle} / {chapterTitle}
        </p>
      </div>
      <div className='d-flex justify-content-end'>
        <button className='mx-3 btn btn-sm btn-warning'>
          <i className="bi bi-chevron-double-left"></i>
        </button>
        <button className='mx-3 btn btn-sm btn-warning'>
          <i className="bi bi-chevron-double-right"></i>
        </button>
        <button className='mx-3 btn btn-sm btn-info' onClick={handleFullView}>
          <i className="mx-2 bi bi-fullscreen"></i>
        </button>
        <button className='mx-3 btn btn-info' onClick={handleShareChapter}>
          <i className="bi bi-share-fill mx-2"></i>
        </button>
      </div>
      <hr />

      <div className="page-navigation-container p-3">
        <div className="page-content">
          {pages.length > 0 ? (
            <div className="border">
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

      <div className="d-flex justify-content-center">
        {currentPage > 0 && (
          <span className="nav-arrow left-arrow" onClick={handlePrevPage}>
            <i className="bi bi-arrow-left-square-fill"></i>
          </span>
        )}
        {currentPage < pages.length - 1 && (
          <span className="nav-arrow right-arrow" onClick={handleNextPage}>
            <i className="bi bi-arrow-right-square-fill"></i>
          </span>
        )}
      </div>

      <div className="px-5 mt-5 resources-container">
        <h3>Resources for this Chapter</h3>
        {resources.length > 0 ? (
          <>
            {renderResources('videos', 'Videos')}
            {renderResources('audio', 'Audio')}
            {renderResources('documents', 'Documents')}
            {renderResources('interactivities', 'Interactivities')}
            {renderResources('addnworksheets', 'Worksheets')}
            {renderResources('addnactivities', 'Additional Activities')}
          </>
        ) : (
          <div>No resources available for this chapter.</div>
        )}
      </div>
    </div>
  );
};

export default MybookChapterpages;
