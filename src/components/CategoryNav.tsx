import "./CategoryNav.css";

const categories = [
  {
    title: "Giới tính",
    items: ["Nam", "Nữ", "Unisex", "Trẻ em"],
  },
  {
    title: "Kiểu dáng",
    items: [
      "Vuông",
      "Chữ nhật",
      "Tròn",
      "Browline",
      "Oval",
      "Đa giác",
      "Mắt mèo",
      "Phi công",
      "Thể thao",
    ],
  },
  {
    title: "Loại gọng",
    items: ["Nguyên khung", "Xẻ cước", "Bắt ốc", "Clip-on"],
  },
  {
    title: "Thương hiệu",
    items: [
      "Bolon",
      "Molsion",
      "Ray-ban",
      "Prada",
      "Oakley",
      "Armani Exchange",
      "Xem thêm",
    ],
  },
];

export default function CategoryNav() {
  return (
    <nav className="category-nav" aria-label="Danh mục sản phẩm">
      <div className="container d-flex flex-wrap gap-3 py-2">
        {categories.map((category, index) => (
          <div className="dropdown" key={category.title}>
            <button
              id={`category-${index}`}
              className="btn dropdown-toggle category-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {category.title}
            </button>

            <ul
              className="dropdown-menu shadow-sm"
              aria-labelledby={`category-${index}`}
            >
              {category.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="dropdown-item"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}