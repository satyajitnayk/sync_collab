import '../css/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="conatiner">
      <div className="content">
        <h1 style={{ color: '#333' }}>404 - Not Found</h1>
        <p style={{ color: '#666' }}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
