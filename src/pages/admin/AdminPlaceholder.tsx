interface AdminPlaceholderProps {
  title: string;
  desc: string;
}

export default function AdminPlaceholder({ title, desc }: AdminPlaceholderProps) {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center bg-white">
      <div className="py-4">
        <div className="display-5 mb-3">🛠️</div>
        <h2 className="h4 fw-bold text-dark mb-2">{title}</h2>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: 480 }}>
          {desc}
        </p>
        <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill fw-semibold">
          Đang chuẩn bị triển khai module
        </span>
      </div>
    </div>
  );
}
