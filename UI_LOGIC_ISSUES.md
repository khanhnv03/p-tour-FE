# Rà soát logic giao diện mock

Ngày rà soát lại: 22/04/2026

Phạm vi: đây là app mock UI, nên tài liệu này không đánh giá theo hướng thiếu API/backend hoặc thiếu xử lý submit thật. Mình tập trung vào việc user nhìn thấy gì, admin có đủ giao diện để tạo ra đúng phần đó chưa, và dữ liệu mẫu giữa các màn có đang gây hiểu nhầm không.

Build kiểm tra: `npm run build` chạy thành công. Chỉ còn warning bundle lớn của Vite, không ảnh hưởng rà soát UI mock.

## Các điểm đã cải thiện rõ

- Blog editor đã có block builder cho paragraph, heading, quote, image, gallery; create/edit blog cũng đã gần cùng một mô hình editor.
- Edit blog đã thống nhất trạng thái hơn: draft/published/scheduled có tab và CTA tương ứng.
- Deal editor đã tách tab `Hiển thị công khai` và `Điều kiện mã giảm`, có ảnh chiến dịch, nhãn, offer badge, CTA và preview card.
- Public deals đã có trạng thái hết hạn/đang hoạt động, có mã copy hoặc auto-apply CTA rõ hơn.
- Add tour đã có section `Hiển thị trên danh sách tour` và đổi tên gallery thành phần hiển thị ở trang chi tiết tour.
- Review trong admin tour đã có trạng thái `Đang chờ`, `Đã hiển thị`, `Đã ẩn`.
- Checkout đã có stepper bắt đầu từ bước 1 và summary khớp với booking detail hơn.
- My bookings đã có link chi tiết cho booking chính, link checkout cho booking chờ thanh toán, và modal hoàn tiền.
- User sidebar/dropdown đã thống nhất hơn: có profile, wishlist, checkout, contact/help.
- Home search đã truyền query sang `/tours`, TourSearch đã đọc `destination` và hiển thị filter chip/count.

## Các điểm còn chưa hợp lý

### 1. Tour detail vẫn không khớp với checkout/booking detail

- **Mức độ:** Cao
- **Vị trí:** `src/pages/TourDetails.tsx`, `src/pages/Checkout.tsx`, `src/pages/BookingDetails.tsx`, `src/pages/MyBookings.tsx`
- **Hiện trạng:** `TourDetails` vẫn là tour Hạ Long với giá `849.000đ` và tổng `1.818.000đ`, trong khi checkout, my bookings và booking detail đã dùng tour `Bình minh trên đỉnh Langbiang` với tổng `27,930,000đ`.
- **Vấn đề mock:** User bấm `Đặt ngay` từ một tour Hạ Long nhưng sang checkout lại thấy một tour Langbiang khác. Đây là mâu thuẫn trải nghiệm lớn dù chỉ là mock.
- **Đề xuất:** Chọn một booking mẫu xuyên suốt. Hoặc đổi `TourDetails` sang Langbiang, hoặc đổi checkout/booking detail về Hạ Long.

### 2. Public tour detail vẫn không thể hiện nhiều tour khác nhau theo route

- **Mức độ:** Cao
- **Vị trí:** `src/pages/TourDetails.tsx`, `src/pages/TourSearch.tsx`, `src/pages/Home.tsx`
- **Hiện trạng:** `TourSearch` và `Home` link tới nhiều slug như `/tour/maldives`, `/tour/italy`, `/tour/ha-long-bay`, nhưng `TourDetails` luôn hiển thị nội dung Hạ Long.
- **Vấn đề mock:** Khi reviewer bấm các card khác nhau, màn detail không phản ánh lựa chọn của họ.
- **Đề xuất:** Với mock, chỉ cần mapping vài slug chính sang dữ liệu mẫu tương ứng, hoặc ghi rõ đây là "Tour mẫu" và chỉ link các card về cùng tour đó.

### 3. Preview card trong AddTour vẫn là dữ liệu tĩnh

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/AddTour.tsx`
- **Hiện trạng:** Form đã có section listing display, nhưng preview card vẫn dùng `Vịnh Sapphire của Na Uy`, ảnh Santorini, `12 Ngày`, `2.499.000đ`.
- **Vấn đề mock:** Admin nhập các field listing nhưng preview không cho cảm giác đang tạo đúng card public.
- **Đề xuất:** Dùng ít nhất mock state/defaultValue cho title, ảnh, thời gian, giá, badge. Nếu chưa binding thật, preview nên đặt cùng ví dụ với các placeholder trong form.

### 4. Itinerary admin đã đổi sang "Ngày", nhưng mỗi ngày vẫn chỉ có một hoạt động

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/AddTour.tsx`, `src/pages/TourDetails.tsx`
- **Hiện trạng:** Admin có `Ngày 1`, `Ngày 2`, mỗi block có một time/title/content/images. Public detail lại có một ngày với nhiều mốc giờ trong timeline.
- **Vấn đề mock:** Admin chưa thể hiện rõ khả năng tạo nhiều hoạt động trong cùng một ngày như public detail đang hiển thị.
- **Đề xuất:** Đổi mô hình UI thành `Ngày -> danh sách hoạt động`, có nút `Thêm hoạt động trong ngày`. Đây là mock rất quan trọng cho tour nhiều ngày.

### 5. ManageTours đã có tab Tour/Điểm đến nhưng dữ liệu card vẫn là destination ở cả hai tab

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/ManageTours.tsx`
- **Hiện trạng:** Tab `Tour` hiển thị tiêu đề `Danh sách Tour`, nhưng card vẫn là `Ha Long Bay`, `Sapa Mountains`, có `region` và `toursCount`. Placeholder vẫn ghi `Tạo khu vực mới`.
- **Vấn đề mock:** Việc tách khái niệm đã tốt hơn, nhưng khi đang ở tab Tour, người dùng admin vẫn thấy dữ liệu destination.
- **Đề xuất:** Tạo dataset tour riêng cho tab `Tour`: tên gói tour, thời lượng, giá, lịch khởi hành, trạng thái. Tab `Điểm đến` dùng dataset destination hiện tại.

### 6. ManageDeals chưa khớp với public Deals và DealEditor mới

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/ManageDeals.tsx`, `src/pages/Deals.tsx`, `src/pages/DealEditor.tsx`
- **Hiện trạng:** Public Deals đã có trạng thái hết hạn theo ngày và campaign Hạ Long 2026. Nhưng ManageDeals vẫn liệt kê deal 2024 là `Đang hoạt động`, có `TẶNG $500`, và chưa thể hiện kiểu code/auto-apply.
- **Vấn đề mock:** Admin list và public list đang nói hai câu chuyện khác nhau về cùng hệ ưu đãi.
- **Đề xuất:** Update ManageDeals theo schema mới: public title, category, valid state, display mode (`copy code`/`auto apply`), preview thumbnail, và trạng thái tự nhất quán với ngày hết hạn.

### 7. DealEditor vẫn còn đơn vị tiền `$` trong loại giảm cố định

- **Mức độ:** Thấp
- **Vị trí:** `src/pages/DealEditor.tsx`
- **Hiện trạng:** Option vẫn là `Số tiền cố định ($)`, trong khi phần lớn app dùng VND.
- **Vấn đề mock:** Dễ gây hiểu nhầm khi nhập deal áp dụng cho tour tính bằng VND.
- **Đề xuất:** Đổi thành `Số tiền cố định (VND)` hoặc thêm selector currency nếu muốn hỗ trợ nhiều tiền tệ.

### 8. Blog public/editor đã tốt hơn, nhưng nội dung mẫu vẫn lệch nhau

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/Journal.tsx`, `src/pages/BlogPost.tsx`, `src/pages/EditBlogPost.tsx`
- **Hiện trạng:** Edit blog đang là bài Patagonia, Journal có bài Kyoto/Dolomites/San Francisco, BlogPost luôn hiển thị Kyoto dù có `useParams`.
- **Vấn đề mock:** Admin vừa chỉnh Patagonia nhưng public detail lại không cho thấy bài đó. Reviewer có thể nghĩ editor không tạo ra được output đang xem.
- **Đề xuất:** Thêm ít nhất một route/detail mock cho bài Patagonia, hoặc đổi editor sample sang đúng bài Kyoto đang dùng ở public detail.

### 9. TourSearch mới chỉ phản ánh `destination`, chưa phản ánh `date` và `guests` từ Home search

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/Home.tsx`, `src/pages/TourSearch.tsx`
- **Hiện trạng:** Home truyền `destination`, `date`, `guests`, nhưng TourSearch chỉ đọc `destination`. Date/guests không xuất hiện ở summary hay filter chip.
- **Vấn đề mock:** User nhập ngày và số khách ở hero search, sang trang kết quả không thấy hai lựa chọn đó được giữ lại.
- **Đề xuất:** Thêm chip `Ngày đi: ...`, `Số khách: ...`; hoặc thêm summary `Đang tìm: Đà Nẵng • 2 khách • ngày ...`.

### 10. TourSearch có một số filter/sort còn là visual tĩnh

- **Mức độ:** Thấp
- **Vị trí:** `src/pages/TourSearch.tsx`
- **Hiện trạng:** Duration và destination đã có chip/count. Nhưng price range, hạng dịch vụ, sort `Giá thấp`/`Xếp hạng cao` vẫn không đổi trạng thái.
- **Vấn đề mock:** Nếu reviewer thử các control này, phản hồi chưa nhất quán với duration/destination.
- **Đề xuất:** Với mock, chỉ cần thêm selected state/chip/count giả cho price/stars/sort.

### 11. Admin order vẫn chưa khớp với booking/checkout mới

- **Mức độ:** Cao
- **Vị trí:** `src/pages/ManageOrders.tsx`, `src/pages/OrderDetails.tsx`, `src/pages/Checkout.tsx`, `src/pages/BookingDetails.tsx`
- **Hiện trạng:** Checkout/booking đang dùng `Bình minh trên đỉnh Langbiang` và `27,930,000đ`. Admin order list/detail vẫn là `VA-88291`, `Amalfi Dream Cruise`, `Bora Bora Overwater Escape`, `Sarah Cunningham`, `12.450.000đ`.
- **Vấn đề mock:** Sau khi user thanh toán/đặt tour, admin không có màn đối soát cùng đơn đó.
- **Đề xuất:** Đổi một order mẫu trong `ManageOrders` và `OrderDetails` sang `BK-1934`, tour Langbiang, khách Alex PTIT, tổng `27,930,000đ`.

### 12. Admin customer vẫn chưa khớp với user portal

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/ManageCustomers.tsx`, `src/pages/CustomerDetails.tsx`, `src/layouts/UserLayout.tsx`, `src/pages/UserProfile.tsx`
- **Hiện trạng:** User portal dùng `Alex PTIT`; admin customer list có `Julian Thorne`, `Elena Rodriguez`; detail lại là `Liam Harper`.
- **Vấn đề mock:** Không có cảm giác admin đang xem/chỉnh đúng user đang sử dụng app.
- **Đề xuất:** Thêm `Alex PTIT` vào customer list và làm customer detail hiển thị cùng avatar/email/booking `BK-1934`.

### 13. Admin customer actions vẫn chưa thể hiện flow view/edit/block

- **Mức độ:** Trung bình
- **Vị trí:** `src/pages/ManageCustomers.tsx`, `src/pages/CustomerDetails.tsx`
- **Hiện trạng:** Route `/admin/customers/:id` tồn tại, nhưng action list vẫn là button icon. Detail có nút `Sửa thông tin` nhưng chưa có chế độ edit/modal mock.
- **Vấn đề mock:** Admin thấy có chức năng quản lý user nhưng chưa hiểu flow sửa/chặn sẽ diễn ra như thế nào.
- **Đề xuất:** Icon view nên là Link sang detail. Nút edit/block nên mở modal mock hoặc detail có toggle `Chế độ chỉnh sửa`.

### 14. My Bookings vẫn còn một nút `Chi tiết` chưa mở detail

- **Mức độ:** Thấp
- **Vị trí:** `src/pages/MyBookings.tsx`
- **Hiện trạng:** Booking chính đã link tới `/my-bookings/BK-1934`, nhưng booking chờ thanh toán vẫn có nút `Chi tiết` dạng button tĩnh.
- **Vấn đề mock:** Các hàng trong cùng danh sách có hành vi không đồng nhất.
- **Đề xuất:** Đổi nút này thành link tới một detail mock hoặc bỏ nút nếu chỉ muốn dẫn user tới `Hoàn tất thanh toán`.

### 15. Review sau khi user gửi vẫn chưa thể hiện trạng thái chờ duyệt

- **Mức độ:** Thấp
- **Vị trí:** `src/pages/BookingDetails.tsx`, `src/pages/AddTour.tsx`
- **Hiện trạng:** Admin tour đã có trạng thái moderation, nhưng user gửi review trong booking detail chỉ đóng modal.
- **Vấn đề mock:** User không biết đánh giá sẽ đăng ngay hay đang chờ duyệt.
- **Đề xuất:** Sau modal, hiển thị toast/badge mock `Đánh giá đã gửi, đang chờ duyệt`.

## Ưu tiên chỉnh tiếp

1. Đồng bộ tour mẫu từ `TourDetails` sang `Checkout`, `MyBookings`, `BookingDetails`.
2. Đồng bộ admin order với booking mẫu mới.
3. Tách dữ liệu thật sự giữa tab `Tour` và `Điểm đến` trong ManageTours.
4. Cập nhật ManageDeals theo schema mới của Deals/DealEditor.
5. Đồng bộ user `Alex PTIT` với admin customer list/detail.
6. Hoàn thiện các preview/selected state còn tĩnh: AddTour preview, TourSearch date/guests/sort/filter.
