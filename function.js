const hienmenu=() => fetch("http://localhost:3000/loai").then(res=>res.json()).then(loai_arr =>{
    let str = `<a href='index.html'>Trang chủ</a>`;
    str += `<a href='giohang.html'>Giỏ hàng</a>`;
    str += `<a href='dangky.html'>Đăng kí</a>`;
    loai_arr.forEach(loai => {
        str+=`<a href="loai.html?id=${loai.id}">${loai.ten_loai}</a>
        `;
        
    });
    
    document.querySelector("nav").innerHTML= str;
})
const hienspmoi = sosp =>
fetch("http://localhost:3000/san_pham?_sort=ngay&_limit=20").t*hen(res=> res.json()).then(spmoi_arr=>{
    let str =``;
    spmoi_arr.forEach( sp => str+= hien1sp(sp))
    document.querySelector("main").innerHTML =
    `
    <div class='listsp'>
       <h2 >Sản Phẩm mới</h2>
       <div id="data">${str}</div>
    </div>`;
})
function redirectToDetailPage(productId) {
    // Chuyển hướng sang trang chitiet.html và truyền id sản phẩm
    window.location.href = `chitiet.html?id=${productId}`;
}
function hienformdangky() {
    let str = `
    <p> Họ Tên <input type='text' id='ho_ten'></p>
    <p> Mật khẩu <input type='password' id='mat_khau'></p>
    <p> Email <input type='email' id='email'></p>
    <p> <button in="btndk" onclick="return validformdk()">Đăng ký</button></p>
    `;
    document.querySelector("main").innerHTML =
        `<div class='formdk'>
        <h2> Đăng ký Thành Viên</h2>
        <b id="thongbao"></b>
        <form id="formdk"> ${str}</form>
    </div> 
    `;

}
function validformdk() {
    let ht = document.getElementById("ho_ten");
    let mk = document.getElementById("mat_khau");
    let em = document.getElementById("email");
    let thongbao = "";
    if (ht.value == "") thongbao += 'Chưa nhập họ tên<br>';
    if (mk.value == "") thongbao += 'Chưa nhập mật khẩu<br>';
    else if (mk.value.length < 6) thongbao += 'Mật khẩu ngắn quá<br>';
    if (em.value == "") thongbao += 'Chưa nhập email<br>';
    if (thongbao == "") thongbao = "Đã nhập đủ thông tin";
    document.getElementById("thongbao").innerHTML = thongbao;
    return false;
}
const hiensptheoloai = id =>
    fetch(`http://localhost:3000/san_pham?_sort=-ngay&id_loai=${id}`)
    .then(res => res.json()).then( sp_arr => {
    let str = ``;
    sp_arr.forEach(sp => str += hien1sp(sp));
    document.querySelector("main").innerHTML =
        `<div class='listsp'>
        <h2>Sản Phẩm Theo Loai</h2>
        <div id="data"> ${str} </div>
    </div>`;
})
const hien1sp = (sp) => {
    let { id, ten_sp, hinh, gia, ngay } = sp;
    return `<div class="sp">
        <h3>${ten_sp}</h3>
        <img src="${sp.hinh}" onclick="redirectToDetailPage(${sp.id})">
        <h4>Giá: ${gia}<h4>
        <p>Ngày: ${ngay}</p>
        <button onclick="addtocart(${sp.id})">Thêm vào giỏ</button>
    </div>`
}
const chitietsp = async id => {
    const sp_a = await fetch(`http://localhost:3000/san_pham?id=${id}`)
    .then (res => res.json()).then (d => d[0]);
    const sp_b = await fetch(`http://localhost:3000/thuoc_tinh?id=${id}`)
    .then (res => res.json()).then (d => d[0]);
    let sp = { ...sp_a, ...sp_b }
    let str = `
    <div id='left'> <img src='${sp.hinh}'> </div>
    <div id='right'>
    <h3>${sp.ten_sp}</h3> <p>Giá: ${sp.gia}</p>
    <p>RAM: ${sp.ram}</p> <p>CPU: ${sp.cpu}</p>
    <p>SIM: ${sp.sim}</p> <p>Blue Tooth: ${sp.blue_tooth}</p>
    <p> <input type='number' value='1'></p>
    <button onclick="addtocart(${sp.id})">Thêm vào giỏ</button>
    </div>`;
    document.querySelector("main").innerHTML =
        `<div class='detail'>
<h2>Chi tiết sản phẩm</h2>
<div id="detail"> ${str} </div>
</div>`;
}
const addtocart = async (id, so_luong = 1) => { 
    let sp = await fetch(`http://localhost:3000/san_pham?id=${id}`)
    .then(res => res.json()).then( d => d[0]);
    if (sp == null) { alert("không biết sp"); return } 
    sp['so_luong'] = so_luong; cart_local = localStorage.getItem("cart"); 
    let cart = (cart_local == null) ? [] : JSON.parse(cart_local); 
    let index = cart.findIndex(sp => sp.id == id); 
    if (index >= 0) cart[index]['so_luong'] += so_luong;
    else cart.push(sp); 
    localStorage.setItem("cart", JSON.stringify(cart)); 
}
const hiengiohang = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart == null || cart.length === 0) {
        document.querySelector("main").innerHTML = `<h2 class='cartempty'>Chưa có sản phẩm nào</h2>`;
        return;
    }
    document.querySelector("main").innerHTML = 
    `<div id='giohang'>
        ${cart_header()}
        ${cart_body(cart)}
        ${cart_tong(cart)}
        ${cart_footer()}
    </div>`;
};

const cart_header = () => `
    <h4>Giỏ hàng của bạn</h4> 
    <p><b>Tên sp</b> <b>Giá</b> <b>Số lượng</b> <b>Tiền</b> <b>Xóa</b></p>`;

const cart_body = (cart) => {
    return cart.map(sp => `
        <p> 
            <span>${sp.ten_sp}</span>
            <span>${Number(sp.gia).toLocaleString("vi")} VNĐ</span>
            <span>${sp.so_luong}</span> 
            <span>${Number(sp.so_luong * sp.gia).toLocaleString("vi")} VNĐ</span> 
            <span><button class='btn btn-danger' onclick="removeItem('${sp.id}')">X</button></span>
        </p>`).join("");
};

const cart_tong = (cart) => {
    let tong_so_luong = 0;
    let tong_tien = 0;
    cart.forEach(sp => {
        tong_so_luong += sp.so_luong;
        tong_tien += sp.so_luong * sp.gia;
    });
    return `<p> 
        <b>Tổng </b> 
        <b></b> 
        <b>${tong_so_luong}</b> 
        <b>${tong_tien.toLocaleString("vi")} VNĐ</b> 
        <b></b> 
    </p>`;
};

const cart_footer = () => {
    return `<p class='nut'>
        <b><a class="btn btn-info" href="/"> Tiếp tục mua hàng </a></b>
        <b><a class="btn btn-warning" href="thanhtoan.html"> Thanh toán </a></b>
        <b><button class="btn btn-info" onclick="clearCart()"> Xóa giỏ hàng </button></b>
    </p>`;
};

const removeItem = (itemId) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    hiengiohang();
};

const clearCart = () => {
    localStorage.removeItem("cart");
    hiengiohang();
};

// Gọi hàm hiengiohang để hiển thị giỏ hàng khi trang được tải
hiengiohang();

const hienspgiamgia  = phantram =>{
    //code tạo prommise
    let layspgiamgia = new Promise ((r1, r2) => {
        fetch(`http://localhost:3000/san_pham?giam_gia=${phantram}`)
        .then( res => res.json())
        .then( kq => r1(kq))
        .catch( err => r2(err));
    });
    //code gọi promise    
    layspgiamgia.then(
        hienketqua = sp_arr => {
            let str =``; sp_arr.forEach( sp => str+= hien1sp(sp))
            document.querySelector("main").innerHTML=
            `<div class='listsp'>
               <h2> Sản phẩm giảm giá ${phantram}</h2>
               <div id="data">${str}</div>
            </div>`;
        },
        loi = err => alert("Lỗi tìm kiếm: " + err)
    )
    }
    const hienselectgiamgia = () =>{
        str=`<div id='frmtim'>
              <select onchange="dentranggiamgia(this.value)" >
                <option value="0%"> Không giảm giá </option>
                <option value="5%"> Giảm giá 5% </option>
                <option value="10%"> Giảm giá 10%</option>
                <option value="20%"> Giảm giá 20% </option>
                <option value="50%"> Giảm giá 20% </option>
              </select>
              </div>`
document.querySelector("header").innerHTML+=str;
}
const dentranggiamgia = phantram =>{
    alert ("Bạn muốn chọn:" + phantram)
    document.location=`giamgia.html?pt=${phantram}`
}  
const hienformthanhtoan = () => {
    let str = `
    <p> Họ tên <input type='text' id='ho_ten'></p>
    <p> Địa chỉ <input type='text' id='dia_chi'></p>
    <p> Địện thoại <input type='text' id='dien_thoai'></p>
    <p> Địa chỉ email <input type='text' id='email'></p>
    <button type='button' id="btntt" onclick='guithanhtoan()' onclick="return validformdtt()"> Thanh toán</button></p>
    `;
    document.querySelector("main").innerHTML=
    `<div class='formthanhtoan'>
        <h2> Thanh Toán đơn hàng </h2>
        <b id="thongbao"></b>
        <form id="formthanhtoan"> ${str}</form>
    </div>`;
}
// function validformtt() {
//     let ht = document.getElementById("ho_ten");
//     let dc = document.getElementById("dia_chi");
//     let dt = document.getElementById("dien_thoai");
//     let em = document.getElementById("email");
//     let thongbao = "";
//     if (ht.value == "") thongbao += 'Chưa nhập họ tên<br>';
//     if (dc.value == "") thongbao += 'Chưa nhập địa chỉ<br>';
//     if (dt.value == "") thongbao += 'Chưa nhập số điện thoại<br>';
//     else if (dt.value.length < 10) thongbao += 'Số điện thoại ngắn quá<br>';
//     if (em.value == "") thongbao += 'Chưa nhập email<br>';
//     if (thongbao == "") thongbao = "Đã nhập đủ thông tin";
//     document.getElementById("thongbao").innerHTML = thongbao;
//     return false;
// }
const guithanhtoan =()=>{
    let luudonhang = new Promise ((luugiohang, loi) => {
        data={ ho_ten:document.getElementById('ho_ten').value,
    dia_chi: document.getElementById('dia_chi').value,
dien_thoai: document.getElementById('dien_thoai').value,
email: document.getElementById('email').value
}
opt= { method :'post', body: JSON.stringify(data),
headers:{'Content-Type':'app.lication/json'}}
fetch(`http://localhost:3000/don_hang`, opt)
.then(res => res.json()).then(don_hang => luugiohang(don_hang))
.catch(err => loi(err));
    });
    luudonhang.then(
        luudonhang = don_hang => {
            id_dh = don_hang.id; alert('id_dh=' + id_dh);
    cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach( sp => {
        data = {id_dh:id_dh,id_sp: sp.id,ten_sp:sp.ten_sp,so_luong:so.so_luong, gia:sp.gia}
        opt = { method :'post', body: JSON.stringify(data),
                headers:{'Content-Type':'application/json'}}
    fetch("http://localhost:3000/don_hang_chi_tiet", opt)
    })
        },
        loi = err => alert("lỗi lưu đơn hàng:" + err)
    );
}
        

