const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create a new workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Sample Data
const sheet1Data = [
  ['Tên sản phẩm', 'Số lượng', 'Giá', 'Tổng'],
  ['Laptop Dell', 10, 15000000, 150000000],
  ['iPhone 14', 5, 20000000, 100000000],
  ['Samsung Galaxy S23', 8, 18000000, 144000000],
  ['iPad Pro', 3, 25000000, 75000000],
  ['MacBook Pro', 2, 35000000, 70000000],
  ['', '', 'Tổng cộng:', 539000000]
];
const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
XLSX.utils.book_append_sheet(wb, ws1, 'Doanh số');

// Sheet 2: Monthly Report
const sheet2Data = [
  ['Tháng', 'Doanh thu', 'Chi phí', 'Lợi nhuận'],
  ['Tháng 1', 350000000, 200000000, 150000000],
  ['Tháng 2', 420000000, 250000000, 170000000],
  ['Tháng 3', 500000000, 300000000, 200000000],
  ['Tháng 4', 380000000, 220000000, 160000000],
  ['Tháng 5', 450000000, 270000000, 180000000],
  ['Tháng 6', 520000000, 310000000, 210000000],
  ['', 'Tổng', 2620000000, 1550000000, 1070000000]
];
const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
XLSX.utils.book_append_sheet(wb, ws2, 'Báo cáo tháng');

// Sheet 3: Employee List
const sheet3Data = [
  ['Mã NV', 'Họ tên', 'Phòng ban', 'Chức vụ', 'Lương'],
  ['NV001', 'Nguyễn Văn A', 'Kinh doanh', 'Trưởng phòng', 25000000],
  ['NV002', 'Trần Thị B', 'Marketing', 'Nhân viên', 15000000],
  ['NV003', 'Lê Văn C', 'Kỹ thuật', 'Kỹ sư', 20000000],
  ['NV004', 'Phạm Thị D', 'Nhân sự', 'Chuyên viên', 18000000],
  ['NV005', 'Hoàng Văn E', 'Tài chính', 'Kế toán', 16000000],
  ['NV006', 'Đỗ Thị F', 'Kinh doanh', 'Nhân viên', 12000000],
  ['NV007', 'Vũ Văn G', 'Kỹ thuật', 'Trưởng phòng', 28000000],
  ['NV008', 'Bùi Thị H', 'Marketing', 'Trưởng phòng', 26000000],
];
const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);
XLSX.utils.book_append_sheet(wb, ws3, 'Nhân viên');

// Create public/pdfs directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public', 'pdfs');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('Created directory:', publicDir);
}

// Write the file
const filePath = path.join(publicDir, 'sample.xlsx');
XLSX.writeFile(wb, filePath);

console.log('✅ Sample Excel file created successfully!');
console.log('📁 Location:', filePath);
console.log('📊 Contains 3 sheets:');
console.log('   - Doanh số (Sales data)');
console.log('   - Báo cáo tháng (Monthly report)');
console.log('   - Nhân viên (Employee list)');
console.log('\n🚀 Test it at: http://localhost:3000/reader?file=/pdfs/sample.xlsx');
