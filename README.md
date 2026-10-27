# Web Mũ Rơm Online

Xem web trực tiếp trên GitHub Pages: https://testchinesecn.github.io/muromonline/

Mỗi lần đẩy mã lên nhánh `main`, GitHub Actions sẽ tự xuất bản nội dung trong `dist/`. Có thể theo dõi tại tab **Actions** của repository.

Website giới thiệu game theo bố cục tham khảo https://tlkn.pgame.vn/, thay nội dung bằng nhân vật và kỹ năng của dự án. Source nằm riêng trong thư mục này, không sửa client, server hoặc dữ liệu tài khoản.

## Chạy trên máy

Chạy `node serve.cjs` trong thư mục này rồi mở http://127.0.0.1:4177. Không cần cài thư viện hoặc build. Có thể đổi cổng bằng biến môi trường `MU_ROM_WEB_PORT`.

Có thể đưa toàn bộ nội dung `dist/` lên hosting tĩnh hoặc Nginx/IIS. Đảm bảo đuôi `.atlas` được phục vụ như tệp văn bản, `.json` là JSON và `.webp` là hình ảnh.

## Nội dung

- Bảng mời kiểu cờ hải tặc hiện khi mở trang, giới thiệu nhóm Zalo nhận code game; nút tham gia mở nhóm trong tab mới, có nút đóng và lựa chọn xem web trước.
- Trang mở đầu với hoạt ảnh gốc Luffy, Zoro và Sanji.
- Nút tải PC / Android / iOS và đăng ký hiện “Đang cập nhật”, theo yêu cầu hiện tại.
- Tin tức, hướng dẫn và sự kiện có tab và hộp đọc nội dung; không gán lịch phát hành hoặc lịch sự kiện chưa công bố.
- Trailer YouTube `Rq_TszukLhk`, mở trong hộp video, có link mở trực tiếp.
- Phòng xem 5 nhân vật: Luffy, Zoro, Sanji, Nami, Usopp.
- 6 kỹ năng mỗi nhân vật: tên, mô tả, năng lượng và cấp mở khóa lấy từ catalog PC; nội tại có trạng thái riêng.
- Hoạt ảnh Spine gốc, biến hình Gear Fourth và Giáp hắc ẩn; có nút thi triển lại và trở về tư thế ban đầu.
- Liên kết Zalo và Fanpage đúng URL người dùng cung cấp.
- Giao diện máy tính, tablet, điện thoại; điều khiển tab bằng phím mũi tên; hộp thoại đóng bằng Escape.

## Thay nội dung sau này

`dist/index.html` chứa bố cục và liên kết, `dist/style.css` chứa giao diện, `dist/app.js` chứa tương tác và bài viết. Thay `data-pending` bằng liên kết tải/đăng ký khi có URL thật. Dữ liệu nhân vật nằm tại `dist/assets/characters.json`.

`prepare-assets.py` xuất các tài nguyên cần cho website từ client cục bộ. Chỉ chạy lại khi cập nhật hình hoặc catalog. Yêu cầu Python có Pillow. Dữ liệu skeleton đã loại đường dẫn máy của tác giả trước khi đưa lên website.

## Nguồn tài nguyên

- Bảng truy nã: `dist/assets/wanted-poster-frame.png`, chỉnh bằng ImageGen từ mẫu người dùng cung cấp; tên và tiền truy nã là chữ HTML thay theo nhân vật.
- Tiền truy nã đối chiếu ngày 27/10/2026 trên [ONE PIECE.com](https://one-piece.com/character/Mugiwarano_itimi/index.html): Luffy 3,000,000,000; Zoro 1,111,000,000; Sanji 1,032,000,000; Nami 366,000,000; Usopp 500,000,000 Berry. Các giá trị nằm trong `dist/assets/characters.json` và `prepare-assets.py`.

- Nền bến cảng và hình giao diện: `01_CLIENT_PROJECT/Assets/Resources/EntryUi/KhoiNguyen/Art`.
- Skeleton và atlas nhân vật: `01_CLIENT_PROJECT/Assets/RecoveredPcContent/herospine/type_1..5/1`.
- Gear Fourth, Giáp hắc ẩn: `01_CLIENT_PROJECT/Assets/Resources/datamanager/spine/zoom_1`, `zoom_3`.
- Chân dung: `01_CLIENT_PROJECT/Assets/Resources/sprites/character on_off`.
- Icon kỹ năng và catalog: `01_CLIENT_PROJECT/Assets/RecoveredPcContent/icons/skill`, `catalog/SkillInfo.json`, `catalog/SkillData.json`.
- Rương kho báu: vùng `chest_open` trong atlas `Resources/BuggyTreasure/treasure.png`.
- Runtime: `@esotericsoftware/spine-webgl` 4.1.56, giữ nguyên thông tin giấy phép trong file phát hành. Giấy phép runtime của Esoteric Software áp dụng khi phân phối hoặc phát hành tài nguyên Spine.
- Phông chữ: Barlow Condensed và Be Vietnam Pro từ Google Fonts; có phông hệ thống dự phòng.

Ảnh kiểm tra và kết quả QA cục bộ được lưu tại `qa/`, không đưa vào bản hosting.
