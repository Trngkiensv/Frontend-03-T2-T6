export default function Footer() {
    return (
        <footer className="bg-dark text-light mt-auto">
            <div className="container py-4">
                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <h2 className="h5 text-light mb-3">BLACKGLASSES</h2>
                        <p className="small mb-2">
                            Địa chỉ: 123 Đường Demo, Phường Mẫu, TP. HCM
                        </p>
                        <p className="small">Điện thoại: 0000 000 000</p>
                    </div>
                    <div className="col-12 col-md-4">
                        <h3 className="h6 mb-3">Mạng xã hội</h3>
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                            >
                                Facebook
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                            >
                                Instagram
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                            >
                                TikTok
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <h3 className="h6 mb-3">Chính sách</h3>
                        <div className="d-flex flex-column align-items-start gap-2">
                            <button
                                type="button"
                                className="btn btn-link text-light text-decoration-none p-0"
                            >
                                Chính sách đổi trả
                            </button>
                            <button
                                type="button"
                                className="btn btn-link text-light text-decoration-none p-0"
                            >
                                Chính sách bảo hành
                            </button>
                            <button
                                type="button"
                                className="btn btn-link text-light text-decoration-none p-0"
                            >
                                Chính sách bảo mật
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-top border-secondary mt-4 pt-3 text-center">
                    <p className="small mb-0">
                        © {new Date().getFullYear()} BLACKGLASSES
                    </p>
                </div>
            </div>
        </footer>
    );
}
