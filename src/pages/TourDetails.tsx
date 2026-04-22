import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_NAME, BRAND_LOGO } from '../constants';

interface TourMock {
  name: string;
  breadcrumb: string;
  location: string;
  rating: number;
  reviews: number;
  duration: string;
  maxGuests: string;
  difficulty: string;
  pricePerPerson: number;
  coverImage: string;
  galleryImages: string[];
  description: string;
  highlights: { icon: string; label: string }[];
  itinerary: { day: number; title: string; summary: string; activities: { time: string; desc: string }[] }[];
  includes: string[];
}

const TOURS: Record<string, TourMock> = {
  langbiang: {
    name: 'Bình minh trên đỉnh Langbiang',
    breadcrumb: 'Lâm Đồng',
    location: 'Lâm Đồng, VN',
    rating: 4.9,
    reviews: 86,
    duration: '5 Ngày, 4 Đêm',
    maxGuests: 'Tối đa 12 khách',
    difficulty: 'Trung bình',
    pricePerPerson: 13300000,
    coverImage: 'https://picsum.photos/seed/tour1/1200/800',
    galleryImages: [
      'https://picsum.photos/seed/lang1/600/400',
      'https://picsum.photos/seed/lang2/600/400',
      'https://picsum.photos/seed/lang3/600/400',
      'https://picsum.photos/seed/lang4/600/400',
    ],
    description:
      'Hành trình chinh phục đỉnh Langbiang huyền thoại, nơi bình minh đỏ rực bao phủ cao nguyên Đà Lạt trong sương mờ. Tour độc bản với hướng dẫn viên cứu hộ chuyên nghiệp Trần Quang, lưu trú 4 đêm tại Swiss-Belresort Tuyen Lam và trải nghiệm ẩm thực vùng cao đặc sắc.',
    highlights: [
      { icon: 'hiking', label: 'Leo núi Langbiang lúc 4:00 sáng' },
      { icon: 'hotel', label: 'Swiss-Belresort Tuyen Lam 4 sao' },
      { icon: 'restaurant', label: 'Ẩm thực đặc sản Đà Lạt' },
      { icon: 'camera', label: 'Chụp ảnh cung đường hoa dã quỳ' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Đà Lạt: Khởi hành & Check-in',
        summary: 'Xe đón tại Sân bay Liên Khương, di chuyển về Đà Lạt, check-in resort và khám phá thành phố hoa.',
        activities: [
          { time: '10:00', desc: 'Đón tại sân bay Liên Khương, di chuyển về Đà Lạt' },
          { time: '14:00', desc: 'Check-in Swiss-Belresort Tuyen Lam, nghỉ ngơi' },
          { time: '17:00', desc: 'Tham quan Hồ Xuân Hương và chợ đêm Đà Lạt' },
          { time: '19:00', desc: 'Tối ăn tối đặc sản bánh tráng nướng, sữa đậu nành' },
        ],
      },
      {
        day: 2,
        title: 'Chinh phục đỉnh Langbiang',
        summary: 'Khởi hành sớm để kịp bình minh, leo núi cùng HDV cứu hộ Trần Quang và ngắm toàn cảnh cao nguyên Lâm Viên.',
        activities: [
          { time: '04:00', desc: 'Xuất phát từ resort, di chuyển lên chân núi Langbiang' },
          { time: '05:30', desc: 'Đón bình minh từ đỉnh núi 2.167m — khoảnh khắc nhớ đời' },
          { time: '07:30', desc: 'Ăn sáng cùng HDV với đặc sản bánh cuốn Đà Lạt' },
          { time: '09:00', desc: 'Xuống núi, nghỉ ngơi tại resort, tự do buổi chiều' },
        ],
      },
      {
        day: 3,
        title: 'Thung lũng Vàng & Thác Datanla',
        summary: 'Khám phá những thắng cảnh nổi tiếng quanh Đà Lạt với xe jeep cổ điển địa phương.',
        activities: [
          { time: '08:00', desc: 'Thuê xe jeep cổ điển, xuất phát khám phá vùng ngoại ô' },
          { time: '10:30', desc: 'Thác Datanla và trải nghiệm trượt máng' },
          { time: '14:00', desc: 'Vườn hoa Vạn Thành và đồi chè Cầu Đất' },
          { time: '18:00', desc: 'Hoàng hôn trên thung lũng, tối BBQ ngoài trời' },
        ],
      },
      {
        day: 4,
        title: 'Làng Cù Lần & Rừng thông',
        summary: 'Thăm làng dân tộc thiểu số, cưỡi ngựa trong rừng thông và thư giãn tại resort.',
        activities: [
          { time: '09:00', desc: 'Thăm Làng Cù Lần và tìm hiểu văn hóa dân tộc Lạch' },
          { time: '11:30', desc: 'Cưỡi ngựa dạo rừng thông Đa Thiện' },
          { time: '15:00', desc: 'Spa & massage thư giãn tại Swiss-Belresort' },
          { time: '20:00', desc: 'Bữa tối tiệc chia tay với rượu vang Đà Lạt' },
        ],
      },
      {
        day: 5,
        title: 'Trở về – Kết thúc hành trình',
        summary: 'Ăn sáng muộn, mua sắm đặc sản và tiễn đoàn ra sân bay Liên Khương.',
        activities: [
          { time: '08:00', desc: 'Brunch tại resort và check-out' },
          { time: '10:00', desc: 'Ghé chợ Đà Lạt mua đặc sản mang về' },
          { time: '12:00', desc: 'Xe đưa đoàn ra sân bay Liên Khương, kết thúc tour' },
        ],
      },
    ],
    includes: [
      'Xe đưa đón sân bay khứ hồi',
      'Phòng nghỉ 4 sao Swiss-Belresort (4 đêm)',
      'Bữa sáng và tối trong hành trình',
      'HDV cứu hộ chuyên nghiệp cả hành trình',
      'Vé tham quan các điểm trong lịch trình',
      'Xe jeep cổ điển ngày 3',
      'Bảo hiểm tai nạn du lịch',
    ],
  },
  'ha-long-bay': {
    name: 'Du thuyền Premium Vịnh Hạ Long',
    breadcrumb: 'Quảng Ninh',
    location: 'Quảng Ninh, VN',
    rating: 4.9,
    reviews: 128,
    duration: '3 Ngày, 2 Đêm',
    maxGuests: 'Tối đa 16 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 5200000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYxBlwy8uojyDVx1tSLMwyGv99xZPD9a4IjrbHfCmAfZ2aP3QixIicyOsYuYYSbL9EWycnEx8d0IcQk51THHdlpuH9_I4UmHDFrZQ65wU-5mgzJXfa5Hhxq_A2KeVJeNnzKWBDscQdu1vzpTVqWgVJfcjrWpEIo3PAJ0xMbIiCz3BQesi8vc61kcYJ_jAw2masf4YQYPCa-0nlX1p2OyYFSXcGL_j6AiJDOMwWDU-ruG3mJMQ-zEOVnEOtxGq1biiiKKBZKn_zcts',
    galleryImages: [
      'https://picsum.photos/seed/halong1/600/400',
      'https://picsum.photos/seed/halong2/600/400',
      'https://picsum.photos/seed/halong3/600/400',
      'https://picsum.photos/seed/halong4/600/400',
    ],
    description:
      'Hành trình qua làn nước xanh màu ngọc bích của Vịnh Hạ Long trên du thuyền hiện đại. Vẻ đẹp nguyên sơ của các đảo đá vôi di sản thế giới UNESCO kết hợp đỉnh cao lòng hiếu khách Việt Nam — từ Thái Cực Quyền trên boong tàu đến bữa tối nến lung linh trong hang động.',
    highlights: [
      { icon: 'kayaking', label: 'Chèo Kayak qua Hang Sáng & Tối' },
      { icon: 'restaurant', label: 'Ẩm thực cao cấp Âu – Á trên tàu' },
      { icon: 'spa', label: 'Dịch vụ Spa & Massage chuyên nghiệp' },
      { icon: 'fitness_center', label: 'Lớp học Tai Chi đón bình minh' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Lên tàu & Hoàng hôn đầu tiên',
        summary: 'Khởi hành từ cảng Tuần Châu, tiến về Vịnh Lan Hạ, chèo Kayak buổi chiều.',
        activities: [
          { time: '12:00', desc: 'Check-in và ăn trưa chào đón trên tàu' },
          { time: '14:00', desc: 'Nhổ neo, tiến vào Vịnh Lan Hạ' },
          { time: '15:30', desc: 'Chèo Kayak khám phá Hang Sáng & Hang Tối' },
          { time: '18:00', desc: 'Tiệc Sunset cocktail và Bữa tối sang trọng' },
        ],
      },
      {
        day: 2,
        title: 'Khám phá mê cung giữa vịnh',
        summary: 'Thái Cực Quyền sáng sớm, thăm làng chài Việt Hải, BBQ hải sản trên bãi biển riêng.',
        activities: [
          { time: '06:30', desc: 'Lớp Thái Cực Quyền trên boong tàu' },
          { time: '09:00', desc: 'Thăm làng chài nổi Việt Hải' },
          { time: '12:30', desc: 'BBQ hải sản tươi sống trên bãi biển riêng' },
          { time: '15:00', desc: 'Câu mực buổi chiều & lớp học nấu ăn' },
        ],
      },
      {
        day: 3,
        title: 'Bình yên buổi sáng & Trở về',
        summary: 'Brunch trên tàu, ngắm cảnh lần cuối rồi cập bến.',
        activities: [
          { time: '07:00', desc: 'Ăn sáng, thư giãn trên boong ngắm cảnh' },
          { time: '09:30', desc: 'Tàu quay về bến cảng Tuần Châu' },
          { time: '11:30', desc: 'Check-out và chia tay đoàn' },
        ],
      },
    ],
    includes: [
      'Phòng nghỉ cabin sang trọng có ban công (2 đêm)',
      'Tất cả các bữa ăn trong hành trình',
      'Nước uống chào mừng và trái cây tươi hàng ngày',
      'Vé tham quan và phí lưu trú trên vịnh',
      'Sử dụng Kayak và thuyền nan',
      'Lớp học Thái Cực Quyền và dạy nấu ăn',
    ],
  },
  maldives: {
    name: 'Thiên đường Maldives: Nghỉ dưỡng 5 sao',
    breadcrumb: 'Maldives',
    location: 'Maldives',
    rating: 4.9,
    reviews: 312,
    duration: '5 Ngày, 4 Đêm',
    maxGuests: 'Tối đa 10 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 45900000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCogkWsfUeEvcsshybb2U8UofOwaSL-ipUP8kA6YEe2PcKo4gNU34YK9aK9EKDkgFrNoUQe7yqmBrqfRApLqcf1ylNa3QLsurtYDC5vlM_9har_AisY9ohN4sCJ2MjeqUjTmKuTk4I2JwvFjCZO82LQ2vnDN1q1P7RwoHfehfVwkYlgnAA--cKOwUfwk2BGWWO7-uB8Yly3tby_jEkAjJJBk7l91oC_W4bum5p0XV18oHrafZqhZuc3mRnsq55KfVc0TqqVVbjxQEY',
    galleryImages: [
      'https://picsum.photos/seed/maldives1/600/400',
      'https://picsum.photos/seed/maldives2/600/400',
      'https://picsum.photos/seed/maldives3/600/400',
      'https://picsum.photos/seed/maldives4/600/400',
    ],
    description:
      'Kỳ nghỉ xa hoa trên đảo san hô xanh biếc, bungalow nổi trên mặt nước crystal, lặn biển ngắm san hô và thư giãn tại spa theo phong cách truyền thống Maldives. Mỗi khoảnh khắc đều là một tấm ảnh hoàn hảo.',
    highlights: [
      { icon: 'water', label: 'Bungalow overwater view biển' },
      { icon: 'scuba_diving', label: 'Lặn ngắm san hô & cá manta' },
      { icon: 'restaurant', label: 'Bữa tối nến tại bàn bên bờ biển' },
      { icon: 'spa', label: 'Spa & massage truyền thống Maldivian' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Thủy phi cơ đến thiên đường',
        summary: 'Bay từ Male tới resort bằng thủy phi cơ, check-in bungalow nổi.',
        activities: [
          { time: '13:00', desc: 'Thủy phi cơ từ Male ra đảo (30 phút)' },
          { time: '14:30', desc: 'Check-in bungalow overwater, nghỉ ngơi' },
          { time: '18:00', desc: 'Cocktail sunset trên sàn bungalow' },
          { time: '20:00', desc: 'Bữa tối khai mạc tại nhà hàng bờ biển' },
        ],
      },
      {
        day: 2,
        title: 'Đại dương xanh ngọc',
        summary: 'Snorkeling rạn san hô, kayak và sunset cruise.',
        activities: [
          { time: '07:00', desc: 'Sáng sớm lặn snorkeling vùng rạn san hô' },
          { time: '10:30', desc: 'Kayak quanh đảo và chèo sup' },
          { time: '15:00', desc: 'Spa massage 90 phút tại spa resort' },
          { time: '17:30', desc: 'Sunset dolphin cruise' },
        ],
      },
      {
        day: 3,
        title: 'Lặn sâu & Đảo địa phương',
        summary: 'Scuba diving có hướng dẫn, thăm đảo địa phương buổi chiều.',
        activities: [
          { time: '08:00', desc: 'Scuba diving có HDV (reef diving)' },
          { time: '14:00', desc: 'Thăm đảo Maafushi — trải nghiệm văn hóa Maldivian' },
          { time: '19:00', desc: 'Bữa tối dưới ánh đèn trên sàn nước' },
        ],
      },
    ],
    includes: [
      'Bungalow overwater 4 đêm',
      'Toàn bộ bữa ăn (all-inclusive)',
      'Thủy phi cơ khứ hồi Male – Resort',
      'Snorkeling và kayak tự do',
      'Một buổi scuba diving có HDV',
      'Spa massage 90 phút (1 lần)',
    ],
  },
  japan: {
    name: 'Nhật Bản: Cung đường vàng Tokyo – Kyoto',
    breadcrumb: 'Nhật Bản',
    location: 'Nhật Bản',
    rating: 4.8,
    reviews: 224,
    duration: '7 Ngày, 6 Đêm',
    maxGuests: 'Tối đa 15 khách',
    difficulty: 'Trung bình',
    pricePerPerson: 32500000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWiGMIrNWl1-cQvJ0XRrrUGDi0PWIy4mw3PCuxYFgA2n1W-hweKF21RNHk1zYwgqs3pQJFY09tAEn9CHCIxKo0G6QNH2PfZfHcaGvSHcCn7AZ7G_M6mfy5YVOilHbCstGh5vIqruj309g10TYX_jpRbaSINPIw2hP71OpBAFXDdaxJWdz4wfQH2HCItBTwu7j0b2K6zoKT8RQt8CaeY6B1vvzq3gKIjeYHnI9hybch0aEMMMbzhseBR04IP9eLpRDRI2y3vjbwEDY',
    galleryImages: [
      'https://picsum.photos/seed/japan1/600/400',
      'https://picsum.photos/seed/japan2/600/400',
      'https://picsum.photos/seed/japan3/600/400',
      'https://picsum.photos/seed/japan4/600/400',
    ],
    description:
      'Hành trình khám phá đất nước Mặt Trời mọc với Tokyo siêu hiện đại, chùa Fushimi Inari nghìn cổng Torii, Kyoto trầm mặc và Nara thân thiện. Trải nghiệm tàu Shinkansen, Omakase sushi và rừng trúc Arashiyama.',
    highlights: [
      { icon: 'temple_buddhist', label: 'Chùa Fushimi Inari – nghìn cổng Torii' },
      { icon: 'train', label: 'Tàu Shinkansen xuyên đất nước' },
      { icon: 'restaurant', label: 'Omakase sushi truyền thống' },
      { icon: 'park', label: 'Rừng trúc Arashiyama' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tokyo: Thành phố không ngủ',
        summary: 'Đáp Tokyo, khám phá Shibuya Crossing và Harajuku.',
        activities: [
          { time: '10:00', desc: 'Đáp sân bay Narita, nhận phòng khách sạn Shinjuku' },
          { time: '14:00', desc: 'Shibuya Crossing & mua sắm Harajuku' },
          { time: '18:00', desc: 'Izakaya tối đầu tiên tại Shinjuku' },
          { time: '20:30', desc: 'Dạo phố Akihabara về đêm' },
        ],
      },
      {
        day: 2,
        title: 'Kyoto: Cổ đô ngàn năm',
        summary: 'Shinkansen tới Kyoto, Fushimi Inari, Kinkakuji.',
        activities: [
          { time: '08:00', desc: 'Shinkansen Tokyo → Kyoto (2h15p)' },
          { time: '11:00', desc: 'Đền Fushimi Inari Taisha' },
          { time: '14:30', desc: 'Kim Các Tự Kinkakuji' },
          { time: '18:00', desc: 'Kaiseki dinner tại nhà hàng cổ' },
        ],
      },
      {
        day: 3,
        title: 'Arashiyama & Nara',
        summary: 'Rừng trúc, chùa Tenryuji và hươu Nara.',
        activities: [
          { time: '07:30', desc: 'Rừng trúc Arashiyama sáng sớm (ít người)' },
          { time: '10:00', desc: 'Chùa Tenryuji và vườn thiền' },
          { time: '13:30', desc: 'Nara – cho hươu ăn bánh senbei' },
          { time: '17:00', desc: 'Quay về Kyoto, tự do tối' },
        ],
      },
    ],
    includes: [
      'Khách sạn 4 sao 6 đêm (Tokyo 3 đêm, Kyoto 3 đêm)',
      'Vé Shinkansen Tokyo – Kyoto khứ hồi',
      'Bữa sáng mỗi ngày',
      'HDV nói tiếng Việt',
      'Vé vào cổng các điểm tham quan trong lịch trình',
      'Bảo hiểm du lịch',
    ],
  },
  italy: {
    name: 'Mùa thu nước Ý: Rome – Venice – Positano',
    breadcrumb: 'Châu Âu',
    location: 'Italy',
    rating: 5.0,
    reviews: 184,
    duration: '10 Ngày, 9 Đêm',
    maxGuests: 'Tối đa 12 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 78000000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjPgqZiYVw_JdsgRCEbh95TOMEQfMNaAXzgUD3vGu9_6AehX4gYVtNS8Ouh6lBzRnW00SZvpQVpGqXL_xbRvYSsDj2vNmBQzJY-_bWh4fzgQRyBdwjsL9-ZR0_fXI_Lna8vk7DcxD0QIH0VnmPFTSPFuBB788Wq01bRnhozZ61xg9mP6bor3r8m_vJP2Rby-Q0seQxi0r8CBhQ_fY6keOQrYdqMq45WxoK2_H9JQZDoHpgmrBvS06o_X96FY21REO2NO_jYSLWYBA',
    galleryImages: [
      'https://picsum.photos/seed/italy1/600/400',
      'https://picsum.photos/seed/italy2/600/400',
      'https://picsum.photos/seed/italy3/600/400',
      'https://picsum.photos/seed/italy4/600/400',
    ],
    description:
      'Hành trình qua những kiệt tác kiến trúc nước Ý: Đấu trường La Mã lừng danh, kênh đào Venice thơ mộng và vách đá Positano rực rỡ sắc màu. Mùa thu nước Ý là thời điểm hoàn hảo để trải nghiệm văn hóa nghìn năm cùng ẩm thực pasta và gelato đích thực.',
    highlights: [
      { icon: 'museum', label: 'Colosseum, Vatican & Nhà nguyện Sistine' },
      { icon: 'directions_boat', label: 'Gondola qua Grand Canal Venice' },
      { icon: 'restaurant', label: 'Pasta & Pizza đích thực nước Ý' },
      { icon: 'beach_access', label: 'Hoàng hôn Positano – Amalfi' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Roma: Vĩnh cửu thành phố',
        summary: 'Khám phá Đấu trường La Mã, Colosseum và dạo bộ khu phố cổ.',
        activities: [
          { time: '09:00', desc: 'Tham quan Colosseum và Diễn đàn La Mã' },
          { time: '13:00', desc: 'Ăn trưa pizza Ý tại quảng trường Navona' },
          { time: '15:00', desc: 'Đài phun nước Trevi và mua sắm Via Condotti' },
          { time: '19:00', desc: 'Tối ăn tối Osteria truyền thống' },
        ],
      },
      {
        day: 2,
        title: 'Vatican & Trastevere',
        summary: 'Bảo tàng Vatican, Nhà thờ Thánh Peter và khu phố Trastevere.',
        activities: [
          { time: '08:30', desc: 'Bảo tàng Vatican và Nhà nguyện Sistine' },
          { time: '12:00', desc: 'Nhà thờ Thánh Peter và Quảng trường' },
          { time: '15:30', desc: 'Dạo bộ khu Trastevere — cà phê Espresso' },
          { time: '19:00', desc: 'Bữa tối rượu vang Chianti' },
        ],
      },
      {
        day: 3,
        title: 'Venice: Thành phố trên nước',
        summary: 'Tàu cao tốc tới Venice, Quảng trường Thánh Marco và gondola trên kênh đào.',
        activities: [
          { time: '08:00', desc: 'Tàu cao tốc Roma → Venice (3h30)' },
          { time: '12:30', desc: 'Quảng trường Thánh Marco và tháp Campanile' },
          { time: '15:00', desc: 'Gondola qua Grand Canal' },
          { time: '20:00', desc: 'Bữa tối Seafood Risotto ven kênh đào' },
        ],
      },
    ],
    includes: [
      'Khách sạn 4 sao 9 đêm (Roma 3, Florence 2, Venice 2, Positano 2)',
      'Bữa sáng mỗi ngày + 3 bữa tối đặc trưng',
      'Vé Colosseum, Vatican và các điểm tham quan',
      'Gondola Venice (1 lần)',
      'Tàu cao tốc liên thành phố',
      'HDV nói tiếng Việt',
    ],
  },
  cambodia: {
    name: 'Campuchia: Huyền bí Angkor Wat',
    breadcrumb: 'Đông Nam Á',
    location: 'Campuchia',
    rating: 4.7,
    reviews: 96,
    duration: '4 Ngày, 3 Đêm',
    maxGuests: 'Tối đa 20 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 9900000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHzO5gCfQ61KnbIr1qP59Oq3HleyYiusR4AjpHkx3MetiOTfayx8KoPUC6Wkd-N95vqI4tItQvbdPcXPMPuCoebJAXq4rt0iA5eojfEiudDYKdfNq3LbpHk0ZwNVX5CV2NbHvCtusOwIiqtDQOIIK3KZjpeaFhH0HpjfE9oeC4auS6S9pfBYKpF51hA4iOJUpGYiL37fKpBL6thzRDGbkQ7ovT2MzT3WdLi4953gdUBJmswVLUlwWUSH1twTJxmW5_HXG456W1Mw',
    galleryImages: [
      'https://picsum.photos/seed/cambodia1/600/400',
      'https://picsum.photos/seed/cambodia2/600/400',
      'https://picsum.photos/seed/cambodia3/600/400',
      'https://picsum.photos/seed/cambodia4/600/400',
    ],
    description:
      'Hành trình khám phá quần thể đền đài Angkor huyền thoại — kỳ quan kiến trúc Khmer vĩ đại nhất Đông Nam Á. Đón bình minh tuyệt đẹp phản chiếu trên hồ nước, dạo bộ qua 216 khuôn mặt đá Bayon và trải nghiệm văn hóa độc đáo vương quốc Chùa Tháp.',
    highlights: [
      { icon: 'temple_buddhist', label: 'Angkor Wat — kỳ quan thế giới' },
      { icon: 'wb_sunny', label: 'Bình minh phản chiếu trên hồ' },
      { icon: 'face', label: 'Đền Bayon — 216 khuôn mặt đá' },
      { icon: 'restaurant', label: 'Ẩm thực Khmer truyền thống' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Siem Reap: Cổng vào Angkor',
        summary: 'Bay đến Siem Reap, khám phá chợ đêm và chuẩn bị cho hành trình đền đài.',
        activities: [
          { time: '14:00', desc: 'Nhận phòng khách sạn, nghỉ ngơi' },
          { time: '16:00', desc: 'Tham quan Pub Street và chợ đêm Siem Reap' },
          { time: '19:00', desc: 'Bữa tối Amok cá truyền thống Khmer' },
        ],
      },
      {
        day: 2,
        title: 'Angkor Wat & Bình minh huyền thoại',
        summary: 'Đón bình minh trên Angkor Wat, khám phá Angkor Thom và đền Bayon.',
        activities: [
          { time: '05:00', desc: 'Đón bình minh tại hồ phản chiếu Angkor Wat' },
          { time: '08:00', desc: 'Tham quan chi tiết Angkor Wat' },
          { time: '11:00', desc: 'Angkor Thom — Cổng phía Nam và đền Bayon' },
          { time: '15:00', desc: 'Đền Ta Prohm — rễ cây khổng lồ ôm đền' },
        ],
      },
      {
        day: 3,
        title: 'Đền ngoại ô & Làng chài Tonle Sap',
        summary: 'Khám phá các đền xa hơn và làng chài nổi trên Biển Hồ.',
        activities: [
          { time: '08:30', desc: 'Banteay Srei — đền hoa văn tỉ mỉ nhất Angkor' },
          { time: '13:00', desc: 'Làng chài nổi Chong Kneas trên Biển Hồ' },
          { time: '17:00', desc: 'Đặc sản chợ chiều Siem Reap' },
        ],
      },
    ],
    includes: [
      'Phòng nghỉ khách sạn 4 sao 3 đêm',
      'Bữa sáng mỗi ngày + 1 bữa tối đặc sản',
      'Vé thăm quan quần thể Angkor (3 ngày)',
      'Xe tuk-tuk hoặc xe hơi đưa đón mỗi ngày',
      'HDV địa phương nói tiếng Việt',
      'Thuyền tham quan Biển Hồ',
    ],
  },
  france: {
    name: 'Kinh đô ánh sáng: Paris – Versailles – Loire',
    breadcrumb: 'Châu Âu',
    location: 'Pháp',
    rating: 4.8,
    reviews: 210,
    duration: '9 Ngày, 8 Đêm',
    maxGuests: 'Tối đa 14 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 62000000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdoVseq_uu6t1tcgrRS5aVw5tU5YAQqYPu0Kva5b7U8cFQ1oDIXmTVZ_aYazYZcz0W8p76BJ7XQe8X5_4_8pc1RYpHo8ub_k6VmSTqz11oI5YCx3cACsznqPQ4QmIieFkaKADi3oHJ1W_3om5B04zjokBgrReqOTPCfrPDlzYS6VmuZvt8ejfjOz2YXjlDFre5SyPjYymPLo8Qp4QupqXBV6SJ-_Y-VKn4W6F034kAqV7IEjG25SvG6I-q_CdMMot-VbnYbx4htKM',
    galleryImages: [
      'https://picsum.photos/seed/france1/600/400',
      'https://picsum.photos/seed/france2/600/400',
      'https://picsum.photos/seed/france3/600/400',
      'https://picsum.photos/seed/france4/600/400',
    ],
    description:
      'Hành trình lãng mạn qua kinh đô ánh sáng Paris với Tháp Eiffel huyền thoại, Bảo tàng Louvre đẳng cấp và cung điện Versailles nguy nga. Khám phá vùng Loire Valley với những lâu đài cổ kính và rượu vang đặc sản nước Pháp.',
    highlights: [
      { icon: 'museum', label: 'Bảo tàng Louvre & Tháp Eiffel' },
      { icon: 'castle', label: 'Cung điện Versailles & vườn ngự uyển' },
      { icon: 'wine_bar', label: 'Rượu vang Loire Valley chính hiệu' },
      { icon: 'bakery_dining', label: 'Croissant sáng sớm tại quán cà phê Pháp' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Paris: Thành phố của những giấc mơ',
        summary: 'Khám phá Tháp Eiffel, Khải Hoàn Môn và dạo bộ đại lộ Champs-Élysées.',
        activities: [
          { time: '09:00', desc: 'Tháp Eiffel — leo lên tầng 2 ngắm toàn cảnh Paris' },
          { time: '13:00', desc: 'Ăn trưa tại quán bistro kiểu Pháp truyền thống' },
          { time: '15:00', desc: 'Khải Hoàn Môn và đại lộ Champs-Élysées' },
          { time: '19:00', desc: 'Tối xem show tại Moulin Rouge' },
        ],
      },
      {
        day: 2,
        title: 'Louvre & Montmartre',
        summary: 'Bảo tàng Louvre và khu nghệ sĩ Montmartre với vườn nho độc đáo.',
        activities: [
          { time: '09:00', desc: 'Bảo tàng Louvre — Mona Lisa và Venus de Milo' },
          { time: '13:30', desc: 'Ăn trưa tại quảng trường Rivoli' },
          { time: '15:30', desc: 'Khu Montmartre — Nhà thờ Sacré-Cœur' },
          { time: '19:00', desc: 'Bữa tối rượu vang Bordeaux' },
        ],
      },
      {
        day: 3,
        title: 'Versailles: Hoàng gia xa hoa',
        summary: 'Một ngày khám phá cung điện Versailles hùng vĩ cách Paris 20km.',
        activities: [
          { time: '09:00', desc: 'Di chuyển tới Versailles bằng tàu RER' },
          { time: '10:00', desc: 'Tham quan Phòng Gương và căn phòng hoàng gia' },
          { time: '13:00', desc: 'Dạo bộ vườn ngự uyển rộng 800 hecta' },
          { time: '17:00', desc: 'Quay về Paris, tối tự do' },
        ],
      },
    ],
    includes: [
      'Khách sạn 4 sao Paris 6 đêm + Loire 2 đêm',
      'Bữa sáng mỗi ngày',
      'Vé Tháp Eiffel (tầng 2), Louvre, Versailles',
      'Thẻ đi tàu Navigo Paris 7 ngày',
      'HDV nói tiếng Việt',
      'Bảo hiểm du lịch',
    ],
  },
  'phu-quoc': {
    name: 'Phú Quốc – Thiên đường Nắng Vàng',
    breadcrumb: 'Kiên Giang',
    location: 'Kiên Giang, VN',
    rating: 4.8,
    reviews: 312,
    duration: '3 Ngày, 2 Đêm',
    maxGuests: 'Tối đa 20 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 5800000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeIEwLdwqQXIoMb_--82ZKhddmH6KmJj1rQRALv9WrzfTEWzudI_6RR7sQNitpL9hsXFt3z2bha8wNgjmjzRRrASa_nGRUfAp0u6f8qoRRsuEcYTZI33YaSCnFor78oBoPZnF54Oo3j8AnXJGo0bz9yBm8LXFzsSuuTH9QmDvw4otKZouSYKj0YXwbl2NxEofqzN-F0Whkk8Bj4zVOvRqlqX7JAAFzR5zaFjtpG_2wMj5uYGtCnvAs3XEG7xLSfRqbT9ceaxBIx4',
    galleryImages: [
      'https://picsum.photos/seed/phuquoc1/600/400',
      'https://picsum.photos/seed/phuquoc2/600/400',
      'https://picsum.photos/seed/phuquoc3/600/400',
      'https://picsum.photos/seed/phuquoc4/600/400',
    ],
    description:
      'Tận hưởng làn nước trong xanh và các hoạt động lặn ngắm san hô kỳ thú tại hòn đảo ngọc của Việt Nam. Phú Quốc nổi tiếng với bãi biển cát trắng mịn, nước biển xanh như ngọc và hải sản tươi ngon đặc trưng.',
    highlights: [
      { icon: 'scuba_diving', label: 'Lặn snorkeling ngắm san hô' },
      { icon: 'beach_access', label: 'Bãi Sao — top bãi biển đẹp nhất VN' },
      { icon: 'restaurant', label: 'Hải sản Phú Quốc ngay tại bờ biển' },
      { icon: 'sailing', label: 'Tour 3 đảo Bắc Phú Quốc' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Đến đảo & Khám phá Nam đảo',
        summary: 'Bay tới Phú Quốc, check-in resort và khám phá Nam đảo.',
        activities: [
          { time: '13:00', desc: 'Đón sân bay Phú Quốc, nhận phòng resort' },
          { time: '15:00', desc: 'Tắm biển bãi Trường — bãi cát dài 20km' },
          { time: '18:00', desc: 'Chợ đêm Phú Quốc — hải sản tươi sống' },
        ],
      },
      {
        day: 2,
        title: 'Tour 3 đảo & Lặn ngắm san hô',
        summary: 'Thuyền khám phá 3 đảo nổi tiếng, lặn biển và câu cá.',
        activities: [
          { time: '08:00', desc: 'Tàu khởi hành tour 3 đảo' },
          { time: '10:00', desc: 'Lặn snorkeling ngắm san hô và cá nhiệt đới' },
          { time: '12:30', desc: 'BBQ hải sản trên biển' },
          { time: '15:00', desc: 'Câu cá và tắm biển tại đảo hoang' },
        ],
      },
      {
        day: 3,
        title: 'Bãi Sao & Trở về',
        summary: 'Buổi sáng tự do tại Bãi Sao — bãi biển đẹp nhất đảo.',
        activities: [
          { time: '08:00', desc: 'Bãi Sao — chụp ảnh buổi sáng trong vắt' },
          { time: '11:00', desc: 'Check-out, mua đặc sản nước mắm, tiêu Phú Quốc' },
          { time: '14:00', desc: 'Ra sân bay, kết thúc hành trình' },
        ],
      },
    ],
    includes: [
      'Resort 4 sao 2 đêm (gần biển)',
      'Bữa sáng + bữa trưa ngày tour 3 đảo',
      'Tour 3 đảo bao gồm lặn biển và câu cá',
      'Xe đưa đón sân bay khứ hồi',
      'HDV địa phương nhiệt tình',
    ],
  },
  sapa: {
    name: 'Chinh phục Fansipan – Sapa',
    breadcrumb: 'Lào Cai',
    location: 'Lào Cai, VN',
    rating: 4.7,
    reviews: 178,
    duration: '4 Ngày, 3 Đêm',
    maxGuests: 'Tối đa 15 khách',
    difficulty: 'Trung bình',
    pricePerPerson: 4500000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSyBUbgczxCwZ61KhP0jBwrZHmjjTqHlx9R6VfAEcBajTbusDwQW698l8XY5GjEs_PAN6sVO__GT5Gm13vCUKh7HJvRxllk52r3yBXINr7_2oCNDjeHT03C87UuFAOgXDemKg1r158tgMsTuvKn3DVTclNnPVQv9YQJ2Xm0LrFb_zlnBLU0E3kO_tpACOkmf-6bgG7Pn8JjDQVCwe8yH3rhh4GdZhu7ta_ubCJb6khrWeE0kkgAFExQY38c1_rQVbA-Tybo6s_QmE',
    galleryImages: [
      'https://picsum.photos/seed/sapa1/600/400',
      'https://picsum.photos/seed/sapa2/600/400',
      'https://picsum.photos/seed/sapa3/600/400',
      'https://picsum.photos/seed/sapa4/600/400',
    ],
    description:
      'Hành trình khám phá nóc nhà Đông Dương Fansipan (3.143m) và văn hóa phong phú của các dân tộc thiểu số vùng cao Sapa. Ruộng bậc thang mùa lúa chín vàng, chợ phiên bản địa và sương mờ bao phủ đỉnh núi — một Việt Nam khác biệt.',
    highlights: [
      { icon: 'mountain_flag', label: 'Cáp treo lên đỉnh Fansipan 3.143m' },
      { icon: 'image', label: 'Ruộng bậc thang Mù Cang Chải mùa vàng' },
      { icon: 'groups', label: 'Chợ phiên dân tộc Bắc Hà' },
      { icon: 'hiking', label: 'Trekking bản Cát Cát và bản Sin Chải' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Sapa: Thành phố sương mù',
        summary: 'Tàu đêm Hà Nội – Lào Cai, khởi động khám phá thị trấn Sapa.',
        activities: [
          { time: '06:00', desc: 'Tàu đến ga Lào Cai, xe đưa lên Sapa' },
          { time: '09:00', desc: 'Check-in, ăn sáng đặc sản thắng cố' },
          { time: '11:00', desc: 'Tham quan chợ Sapa và trung tâm thị trấn' },
          { time: '14:00', desc: 'Trekking bản Cát Cát của người H\'Mông' },
        ],
      },
      {
        day: 2,
        title: 'Fansipan – Nóc nhà Đông Dương',
        summary: 'Cáp treo lên đỉnh Fansipan và trải nghiệm "đứng trên mây".',
        activities: [
          { time: '08:00', desc: 'Cáp treo Sun World Fansipan Legend lên đỉnh 3.143m' },
          { time: '10:00', desc: 'Chụp ảnh tại điểm cao nhất Đông Dương' },
          { time: '12:00', desc: 'Bữa trưa đặc sản cơm lam, thịt nướng' },
          { time: '15:00', desc: 'Trekking qua rừng về lại thị trấn' },
        ],
      },
      {
        day: 3,
        title: 'Ruộng bậc thang & Bản làng',
        summary: 'Khám phá bản Sin Chải và ngắm ruộng bậc thang hùng vĩ.',
        activities: [
          { time: '08:30', desc: 'Trek qua bản Sin Chải của người Dao Đỏ' },
          { time: '11:00', desc: 'Ngắm ruộng bậc thang Mù Cang Chải (mùa vàng)' },
          { time: '15:00', desc: 'Chợ phiên Bắc Hà (cuối tuần)' },
          { time: '18:00', desc: 'Tối lửa trại cùng đồng bào dân tộc' },
        ],
      },
    ],
    includes: [
      'Xe lửa Hà Nội – Lào Cai khứ hồi (cabin giường nằm)',
      'Khách sạn 3 sao Sapa 3 đêm',
      'Bữa sáng mỗi ngày',
      'Vé cáp treo Fansipan',
      'HDV trekking địa phương',
      'Xe đưa đón ga Lào Cai – Sapa',
    ],
  },
  greece: {
    name: 'Santorini: Hừng đông bên bờ Địa Trung Hải',
    breadcrumb: 'Châu Âu',
    location: 'Hy Lạp',
    rating: 4.9,
    reviews: 256,
    duration: '8 Ngày, 7 Đêm',
    maxGuests: 'Tối đa 8 khách',
    difficulty: 'Nhẹ nhàng',
    pricePerPerson: 85000000,
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8f6FW5a1CN3gzBb2n5V30N4rl9U7buaavLFxQAe5ZcqwQ7gjU2QJt-ywKanjEyfyUIYAGpPQkAH36h2Lf2hWz5YeQ64rOGmwfG1JNYrfSti0OzS8SVt1cjyDPH0MCh0ptcFnsLckmPfLLS-J9GiPAObfs_8R094j2a8gIPXhGzaGVmg3yNRiFCK0k1xKxsFvFw2dxkCgR4n-wuhWPxrJfKcWudFSvNha-im-fjeiVe1ZuiAbPmDYh3jRX_ZXECmLGoxn2K7BtV0I',
    galleryImages: [
      'https://picsum.photos/seed/greece1/600/400',
      'https://picsum.photos/seed/greece2/600/400',
      'https://picsum.photos/seed/greece3/600/400',
      'https://picsum.photos/seed/greece4/600/400',
    ],
    description:
      'Hành trình khám phá Hy Lạp với Athens lịch sử ngàn năm và thiên đường Santorini trắng xanh huyền thoại. Ngắm hoàng hôn Oia đẹp nhất thế giới, tắm suối nóng tự nhiên từ núi lửa và thưởng thức ẩm thực Địa Trung Hải đích thực trên vách đá Caldera.',
    highlights: [
      { icon: 'museum', label: 'Đỉnh Acropolis & Đền Parthenon' },
      { icon: 'wb_twilight', label: 'Hoàng hôn Oia — khoảnh khắc vàng' },
      { icon: 'sailing', label: 'Thuyền buồm quanh đảo núi lửa' },
      { icon: 'restaurant', label: 'Ẩm thực Địa Trung Hải chính gốc' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Athens: Chiếc nôi văn minh',
        summary: 'Khám phá Acropolis, Đền Parthenon và phố cổ Plaka.',
        activities: [
          { time: '09:00', desc: 'Tham quan Acropolis và Đền Parthenon' },
          { time: '13:00', desc: 'Ăn trưa Moussaka tại quảng trường Monastiraki' },
          { time: '15:30', desc: 'Phố cổ Plaka và mua sắm đồ lưu niệm' },
          { time: '19:00', desc: 'Tối ăn tối view Acropolis' },
        ],
      },
      {
        day: 2,
        title: 'Bay ra Santorini',
        summary: 'Chuyến bay ngắn tới đảo và check-in cave house nhìn Caldera.',
        activities: [
          { time: '08:00', desc: 'Bay Athens → Santorini (50 phút)' },
          { time: '11:00', desc: 'Check-in cave house Oia nhìn Caldera' },
          { time: '15:00', desc: 'Dạo bộ thị trấn Oia và mua sắm' },
          { time: '19:30', desc: 'Ngắm hoàng hôn nổi tiếng nhất thế giới tại Oia' },
        ],
      },
      {
        day: 3,
        title: 'Caldera Cruise & Bãi biển',
        summary: 'Thuyền buồm quanh đảo núi lửa, bãi biển Red Beach và Perissa.',
        activities: [
          { time: '09:30', desc: 'Thuyền buồm Caldera — đảo núi lửa Nea Kameni' },
          { time: '13:00', desc: 'Tắm suối nóng tự nhiên từ núi lửa' },
          { time: '15:00', desc: 'Red Beach — bãi biển đá đỏ độc đáo' },
          { time: '19:00', desc: 'Tối Seafood Grilled tại Fira' },
        ],
      },
    ],
    includes: [
      'Khách sạn 4 sao Athens 2 đêm + Cave house Santorini 5 đêm',
      'Bữa sáng mỗi ngày',
      'Vé máy bay Athens – Santorini khứ hồi',
      'Tour thuyền buồm Caldera (nửa ngày)',
      'HDV nói tiếng Việt',
      'Bảo hiểm du lịch',
    ],
  },
};

const fmt = (n: number) => n.toLocaleString('vi-VN') + '₫';

export default function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [guestCount, setGuestCount] = useState(2);

  const tour = (id && TOURS[id]) ? TOURS[id] : TOURS['langbiang'];
  const subtotal = tour.pricePerPerson * guestCount;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'inclusions', label: 'Bao gồm' },
    { id: 'reviews', label: 'Đánh giá' },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(25,28,29,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND_LOGO} alt="PTIT Logo" className="h-10 w-auto" />
            <div className="text-xl font-black tracking-tighter text-blue-900 dark:text-blue-50">{BRAND_NAME}</div>
          </Link>
          <div className="hidden md:flex items-center space-x-8 font-medium tracking-tight">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Điểm đến</Link>
            <Link to="/tours" className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 pb-1">Tour</Link>
            <Link to="/deals" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Ưu đãi</Link>
            <Link to="/journal" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Nhật ký</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 px-4 py-2 font-medium hover:bg-slate-100/50 rounded-lg transition-all">Đăng nhập</button>
            <button className="primary-gradient text-white px-6 py-2 rounded-xl font-bold scale-95 active:scale-90 transition-transform">Đăng ký</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-12">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Điểm đến</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/tours" className="hover:text-primary transition-colors">{tour.breadcrumb}</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-semibold">{tour.name}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">{tour.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-secondary text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-sm">{tour.rating}</span>
                  <span className="text-on-surface-variant text-xs ml-1">({tour.reviews} đánh giá)</span>
                </div>
                <div className="flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                  <span className="text-sm font-medium">{tour.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-surface-container-lowest shadow-sm rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="p-3 bg-surface-container-lowest shadow-sm rounded-full hover:bg-surface-container-high transition-colors text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl group">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={tour.name} src={tour.coverImage} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {tour.galleryImages.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-2xl relative group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Gallery ${i + 1}`} src={img} />
              {i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold">+{tour.reviews} Photos</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-6 rounded-2xl mb-12">
          {[
            { icon: 'schedule', label: 'Thời lượng', value: tour.duration },
            { icon: 'groups', label: 'Số người', value: tour.maxGuests },
            { icon: 'mountain_flag', label: 'Độ khó', value: tour.difficulty },
            { icon: 'translate', label: 'Ngôn ngữ', value: 'Anh, Việt' },
          ].map((stat, i) => (
            <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'border-l md:border-outline-variant/20 md:pl-8' : ''}`}>
              <div className="bg-surface-container-lowest p-3 rounded-xl">
                <span className="material-symbols-outlined text-primary">{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="font-bold text-on-surface">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-outline-variant/30 mb-8 flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm whitespace-nowrap transition-all relative ${
                    activeTab === tab.id ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-semibold'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                    <section>
                      <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Trải nghiệm</h3>
                      <p className="text-lg text-on-surface-variant leading-relaxed mb-6">{tour.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl">
                            <span className="material-symbols-outlined text-primary">{h.icon}</span>
                            <span className="font-medium">{h.label}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div key="itinerary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <h3 className="text-2xl font-extrabold mb-8 tracking-tight">Hành trình chi tiết</h3>
                    <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-container-high">
                      {tour.itinerary.map((day, di) => (
                        <div key={di} className="relative pl-12">
                          <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-lg ${di === 0 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                            {day.day}
                          </div>
                          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                            <h4 className={`font-bold text-lg mb-2 ${di === 0 ? 'text-primary' : 'text-on-surface'}`}>
                              Ngày {day.day}: {day.title}
                            </h4>
                            <p className="text-on-surface-variant leading-relaxed mb-4">{day.summary}</p>
                            <div className="space-y-2">
                              {day.activities.map((act, ai) => (
                                <div key={ai} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-xs mt-1 text-primary">circle</span>
                                  <div><span className="font-bold text-on-surface">{act.time}</span> — {act.desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'inclusions' && (
                  <motion.div key="inclusions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-700">
                        <span className="material-symbols-outlined">check_circle</span> Bao gồm trong Tour
                      </h3>
                      <ul className="space-y-4">
                        {tour.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-emerald-500 mt-0.5">done</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-700">
                        <span className="material-symbols-outlined">cancel</span> Không bao gồm
                      </h3>
                      <ul className="space-y-4">
                        {['Đồ uống gọi thêm trong các bữa ăn', 'Dịch vụ Visa và vé máy bay quốc tế', 'Tiền tips cho nhân viên và HDV', 'Bảo hiểm du lịch cá nhân', 'Chi phí cá nhân phát sinh'].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm font-medium">
                            <span className="material-symbols-outlined text-lg text-red-400 mt-0.5">close</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <div className="bg-surface-container-low p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center gap-12">
                      <div className="text-center">
                        <div className="text-6xl font-black text-primary mb-2">{tour.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                        </div>
                        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dựa trên {tour.reviews} đánh giá</div>
                      </div>
                      <div className="flex-1 space-y-3 w-full max-w-md">
                        {[{ stars: 5, pct: 89 }, { stars: 4, pct: 8 }, { stars: 3, pct: 2 }, { stars: 2, pct: 1 }, { stars: 1, pct: 0 }].map(r => (
                          <div key={r.stars} className="flex items-center gap-4">
                            <span className="text-xs font-bold w-4">{r.stars}</span>
                            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} className="h-full bg-secondary" />
                            </div>
                            <span className="text-xs font-bold text-on-surface-variant w-8">{Math.round(tour.reviews * r.pct / 100)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      {[
                        { name: 'Lê Minh Anh', date: '2 tuần trước', rating: 5, comment: 'Một trải nghiệm tuyệt vời vượt mong đợi! HDV rất nhiệt tình và chuyên nghiệp. Chắc chắn sẽ quay lại.', avatar: 'LA' },
                        { name: 'Nguyễn Thảo Trang', date: '1 tháng trước', rating: 5, comment: 'Chuyến đi rất ấn tượng. Cảnh đẹp, dịch vụ chu đáo. Mọi thứ đều vượt kỳ vọng.', avatar: 'TT' },
                        { name: 'David Wilson', date: '2 tháng trước', rating: 4, comment: 'Excellent tour, very well organized. The guide was knowledgeable and friendly. Highly recommend!', avatar: 'DW' },
                      ].map((rev, i) => (
                        <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">{rev.avatar}</div>
                              <div>
                                <h5 className="font-bold text-on-surface">{rev.name}</h5>
                                <p className="text-xs text-on-surface-variant">{rev.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(rev.rating)].map((_, j) => <span key={j} className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                            </div>
                          </div>
                          <p className="text-on-surface-variant leading-relaxed text-sm italic">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Booking Widget */}
          <aside className="lg:w-[400px]">
            <div className="sticky top-24 bg-surface-container-lowest p-8 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-outline-variant/10">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Từ</span>
                <span className="text-3xl font-black text-primary">{fmt(tour.pricePerPerson)}</span>
                <span className="text-on-surface-variant text-sm">/ khách</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Ngày khởi hành</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-4 font-semibold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none" type="text" defaultValue="12 Thg 11, 2026" />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Số lượng khách</label>
                  <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                    <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="font-bold text-lg">{String(guestCount).padStart(2, '0')}</span>
                    <button onClick={() => setGuestCount(Math.min(16, guestCount + 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-outline-variant/30 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Giá tour (x{guestCount} khách)</span>
                  <span className="font-bold">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Thuế & Phí (5%)</span>
                  <span className="font-bold">{fmt(fee)}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{fmt(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full primary-gradient text-white py-5 rounded-2xl font-extrabold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center">
                Đặt ngay
              </Link>
              <p className="text-center text-xs text-on-surface-variant mt-4 font-medium italic">Hủy miễn phí tối đa 48h trước khởi hành</p>
            </div>
          </aside>
        </div>

        {/* Related Tours */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Khám phá tương tự</h2>
              <p className="text-on-surface-variant">Những hành trình đặc sắc dành riêng cho bạn</p>
            </div>
            <Link to="/tours" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Xem tất cả <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(TOURS).filter(([slug]) => slug !== (id || 'langbiang')).slice(0, 3).map(([slug, t]) => (
              <Link key={slug} to={`/tour/${slug}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t.name} src={t.coverImage} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">{t.location}</div>
                </div>
                <h4 className="font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">{t.name}</h4>
                <p className="text-on-surface-variant text-sm mb-2">{t.duration}</p>
                <p className="font-black text-lg">{fmt(t.pricePerPerson)}<span className="text-sm font-normal text-on-surface-variant"> / khách</span></p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto text-sm">
          <div className="space-y-6">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{BRAND_NAME}</div>
            <p className="text-slate-500">Khám phá những chân trời mới cùng trải nghiệm đẳng cấp và cá nhân hóa từ PTIT.</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Khám phá</h5>
            <ul className="space-y-3">
              <li><Link className="text-slate-500 hover:text-blue-600" to="/tours">Tất cả tour</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600" to="/deals">Ưu đãi</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600" to="/journal">Nhật ký</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Hỗ trợ</h5>
            <ul className="space-y-3">
              <li><Link className="text-slate-500 hover:text-blue-600" to="/about">Về chúng tôi</Link></li>
              <li><Link className="text-slate-500 hover:text-blue-600" to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-blue-900 dark:text-blue-100">Bản tin</h5>
            <p className="text-slate-500">Đăng ký nhận ưu đãi độc quyền.</p>
            <div className="flex gap-2">
              <input className="bg-white border-0 rounded-lg px-4 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Email của bạn" type="email" />
              <button className="bg-primary text-white p-2 rounded-lg"><span className="material-symbols-outlined">send</span></button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-8 px-8 text-center text-slate-500 text-xs">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</div>
      </footer>
    </div>
  );
}
