function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-phoenix-warning text-black",
    VERIFIED: "bg-phoenix-success text-black",
    REMOVED: "bg-phoenix-danger text-white",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}