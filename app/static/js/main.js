(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);
// dynamic-region.js

function sendWhatsAppMessage() {
    const name = document.querySelector('[name="full_name"]').value;
    const phone = document.querySelector('[name="phone_number"]').value;
    const governorate = document.querySelector('[name="governorate"]').value;
    const region = document.querySelector('[name="region"]').value;
    const neighborhood = document.querySelector('[name="neighborhood"]').value;
    const houseNumber = document.querySelector('[name="house_number"]').value;
    const query = document.querySelector('[name="query"]').value;

    const myPhoneNumber = "963938446185";
    const message = 
        "مرحبا، لدي استفسار جديد من الموقع:\n\n" +
        "👤 الاسم: " + name + "\n\n" +
        "📱 الجوال: " + phone + "\n\n" +
        "🏙️ المحافظة: " + governorate + "\n\n" +
        "📍 المنطقة: " + region + "\n\n" +
        "🏘️ الحي: " + neighborhood + "\n\n" +
        "🏠 رقم المنزل: " + houseNumber + "\n\n" +
        "📝 الاستفسار:\n" + query;
    const url = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}

var governoratesList = []; // لتخزين المحافظات من API

async function loadGovernorateDropdown() {  
    console.log('🔄 تحميل المحافظات...');

    try {
        const data = await fetchAllGovernorates();
        console.log('✅ المحافظات:', data);

        // تجهيز مصفوفة بصيغة البيانات المطلوبة
        const formattedData = data.map((gov, index) => ({
            'id': gov.Id,
            'رقم': (index + 1).toString(),
            'الاسم': gov.Name
        }));

        // طباعة النتيجة
        console.log('✅ البيانات النهائية:', formattedData);

        return {
            data: formattedData
        };

    } catch (error) {
        console.error('❌ خطأ في تحميل المحافظات:', error);
        return {
            data: [],
            error: error.message
        };
    }
}

var regions = {
    'sweida': [
        'السويداء', 'شهبا', 'عرى', 'المزرعة', 'قنوات', 'الكفر', 'القريا', 
        'المشنف', 'عتيل', 'سهوة الخضر', 'ذيبين', 'ملح', 'الغارية', 'حبران', 
        'رضيمة اللوا', 'سالة', 'الكسيب', 'الصورة الكبيرة', 'عرمان', 
        'المجادل', 'الهيت', 'جرين', 'اللوا', 'داما', 'صماد', 'الثعلة', 
        'المجيمر', 'الطيبة', 'بوسان', 'خازمة', 'الغارية الغربية', 'خربة عواد',
        'الرحا', 'الهويا', 'الهويا الغربية', 'عرى', 'سكاكا', 'أم ضبيب', 
        'بريكة', 'عرى الغربية'
    ],
    'damascus': [
        'المزة', 'الميدان', 'الشاغور', 'المالكي', 'برزة', 'القابون', 
        'ركن الدين', 'دمر', 'جرمانا', 'قدسيا', 'كفرسوسة', 'المهاجرين', 
        'الدويلعة', 'القدم', 'باب توما', 'باب شرقي', 'الزبلطاني', 'جوبر', 
        'القصاع', 'العباسيين'
    ]
};


// دالة تحديث المناطق حسب المحافظة المختارة
function updateRegionOptions() {
    console.log('🔄 تحديث المناطق للمحافظة المختارة...', regions);
    const governorate = document.getElementById('governorate').value;
    const regionDropdown = document.getElementById('region');

    regionDropdown.innerHTML = '<option selected disabled>المنطقة</option>';

    if (!governorate || !regions[governorate]) {
        console.warn('المحافظة غير موجودة أو لا تحتوي على مناطق');
        return;
    }

    regions[governorate].forEach(region => {
        const option = document.createElement('option');
        option.text = region;
        regionDropdown.add(option);
    });
}

function goBack() {
    window.location.href = "/";
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('🔐 بيانات الدخول:', email, password);
});


// viewer
// function createTableController(containerId, tableId, config) {
//   let data = config.data || [];
//   const columns = config.columns || [];
//   let filteredData = [...data];

//   const container = document.getElementById(containerId);
//   if (!container) throw new Error('Container not found');

//   function render() {
//     container.innerHTML = '';

//     // Add Button
//     if (config.enableAddButton !== false) {
//       const addBtn = document.createElement('button');
//       addBtn.textContent = config.addButtonLabel || 'إضافة عنصر جديد';
//       addBtn.className = 'btn btn-success mb-3';
//       addBtn.onclick = openAddDialog;
//       container.appendChild(addBtn);
//     }

//     // Search Input
//     if (config.enableSearch !== false) {
//       const searchInput = document.createElement('input');
//       searchInput.type = 'search';
//       searchInput.placeholder = 'ابحث هنا...';
//       searchInput.className = 'form-control mb-3';
//       searchInput.oninput = (e) => filterData(e.target.value);
//       container.appendChild(searchInput);
//     }

//     // Table
//     const table = document.createElement('table');
//     table.className = 'table table-bordered table-striped text-center';
//     table.style.margin = '10px';

//     const thead = document.createElement('thead');
//     thead.className = 'table-primary';
//     const trHead = document.createElement('tr');

//     columns.forEach(col => {
//       const th = document.createElement('th');
//       th.textContent = col;
//       th.style.padding = '10px';
//       trHead.appendChild(th);
//     });

//     if (tableId === 'btn-governorates') {
//       const thAreas = document.createElement('th');
//       thAreas.textContent = 'المناطق';
//       trHead.appendChild(thAreas);
//     }

//     const thActions = document.createElement('th');
//     thActions.textContent = 'الإجراءات';
//     trHead.appendChild(thActions);

//     thead.appendChild(trHead);
//     table.appendChild(thead);

//     const tbody = document.createElement('tbody');

//     filteredData.forEach((row, idx) => {
//       const tr = document.createElement('tr');

//       columns.forEach(col => {
//         const td = document.createElement('td');
//         td.textContent = row[col] || '';
//         td.style.padding = '10px';
//         tr.appendChild(td);
//       });

//       if (tableId === 'btn-governorates') {
//         const tdAreas = document.createElement('td');
//         const areasBtn = document.createElement('button');
//         areasBtn.textContent = '📍 عرض المناطق';
//         areasBtn.className = 'btn btn-sm';
//         areasBtn.style.backgroundColor = '#07c1ff';
//         areasBtn.style.color = 'black';
//         areasBtn.onclick = () => openAreasModal(row);
//         tdAreas.appendChild(areasBtn);
//         tr.appendChild(tdAreas);
//       }

//       const tdActions = document.createElement('td');

//       const editBtn = document.createElement('button');
//       editBtn.textContent = '✏️';
//       editBtn.className = 'btn btn-sm';
//       editBtn.onclick = () => openEditDialog(idx);
//       tdActions.appendChild(editBtn);

//       const delBtn = document.createElement('button');
//       delBtn.textContent = '🗑️';
//       delBtn.className = 'btn btn-sm';
//       delBtn.onclick = () => deleteRow(idx);
//       tdActions.appendChild(delBtn);

//       tr.appendChild(tdActions);
//       tbody.appendChild(tr);
//     });

//     table.appendChild(tbody);
//     container.appendChild(table);
//   }

//   function filterData(query) {
//     const q = query.trim().toLowerCase();
//     filteredData = q
//       ? data.filter(row =>
//           columns.some(col => (row[col] || '').toLowerCase().includes(q))
//         )
//       : [...data];
//     render();
//   }

//   function openAddDialog() {
//     const modal = document.getElementById('addModal');
//     const title = document.getElementById('addModalTitle');
//     const body = document.getElementById('addModalBody');

//     body.innerHTML = '';

//     if (tableId === 'btn-governorates') {
//       title.textContent = 'إضافة محافظة جديدة';
//       const input = document.createElement('input');
//       input.type = 'text';
//       input.placeholder = 'اسم المحافظة';
//       input.className = 'form-control';
//       input.id = 'newGovernorateName';
//       body.appendChild(input);
//     } else {
//       title.textContent = 'إضافة عنصر جديد';
//       columns.forEach(col => {
//         const input = document.createElement('input');
//         input.type = 'text';
//         input.placeholder = col;
//         input.className = 'form-control';
//         input.dataset.col = col;
//         body.appendChild(input);
//       });
//     }

//     document.getElementById('saveAddBtn').onclick = saveNewItem;
//     modal.style.display = 'block';
//   }

//   function saveNewItem() {
//     let newData = {};

//     if (tableId === 'btn-governorates') {
//       const name = document.getElementById('newGovernorateName').value.trim();
//       if (!name) return showNotification('❌ يرجى إدخال اسم المحافظة', true);
//       newData['الاسم'] = name;
//       newData['المناطق'] = [];
//     } else {
//       const inputs = document.querySelectorAll('#addModalBody input');
//       inputs.forEach(input => {
//         newData[input.dataset.col] = input.value.trim();
//       });
//     }

//     data.push(newData);
//     filteredData = [...data];
//     render();
//     closeAddModal();
//     showNotification('✅ تمت الإضافة بنجاح');
//   }

//   function openEditDialog(idx) {
//     let currentData = data[idx];
//     openDialog('تعديل العنصر', currentData, (newData) => {
//       data[idx] = newData;
//       filteredData = [...data];
//       render();
//     });
//   }

//   function deleteRow(idx) {
//     if (confirm('هل أنت متأكد من الحذف؟')) {
//       data.splice(idx, 1);
//       filteredData = [...data];
//       render();
//     }
//   }

//   function openDialog(title, currentData, onSave) {
//     let newData = {};
//     for (const col of columns) {
//       let val = prompt(`${title} - ${col}`, currentData[col] || '');
//       if (val === null) return;
//       newData[col] = val.trim();
//     }
//     onSave(newData);
//   }

//   function closeAddModal() {
//     document.getElementById('addModal').style.display = 'none';
//   }

//   function showNotification(message, isError = false) {
//     const notif = document.getElementById('addModalNotification');
//     notif.textContent = message;
//     notif.style.backgroundColor = isError ? '#dc3545' : '#28a745';
//     notif.style.display = 'block';
//     setTimeout(() => (notif.style.display = 'none'), 3000);
//   }

//   render();

//   return { render, filterData };
// }


function createTableController(containerId, tableId, config) {
  let currentGovernorateForModal = null;
  const container = document.getElementById(containerId);
  if (!container) throw new Error('Container not found');

  const columns = config.columns || [];
  let data = config.data || [];
  const options = {
    enableSearch: config.enableSearch ?? true,
    enableAddButton: config.enableAddButton ?? true,
    enableEditButton: config.enableEditButton ?? true,
    enableDeleteButton: config.enableDeleteButton ?? true,
    addButtonLabel: config.addButtonLabel || 'إضافة عنصر جديد',
    isEditEnabled: config.isEditEnabled || (() => true),
    isDeleteEnabled: config.isDeleteEnabled || (() => true),
  };

  let filteredData = [...data];

  function render() {
    container.innerHTML = '';

    if (options.enableAddButton) {
      const addBtn = document.createElement('button');
      addBtn.textContent = options.addButtonLabel;
      addBtn.className = 'btn btn-success mb-3';
      addBtn.onclick = openAddDialog;
      container.appendChild(addBtn);
    }

    if (options.enableSearch) {
      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'ابحث هنا...';
      searchInput.className = 'form-control mb-3';
      searchInput.oninput = (e) => filterData(e.target.value);
      container.appendChild(searchInput);
    }

    const table = document.createElement('table');
    table.className = 'table table-bordered table-striped text-center';
    table.style.margin = '10px';

    const thead = document.createElement('thead');
    thead.className = 'table-primary';
    const trHead = document.createElement('tr');

    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      th.style.padding = '10px';
      trHead.appendChild(th);
    });

    if (tableId === 'btn-governorates') {
      const thAreas = document.createElement('th');
      thAreas.textContent = 'المناطق';
      trHead.appendChild(thAreas);
    }

    if (options.enableEditButton || options.enableDeleteButton) {
      const thActions = document.createElement('th');
      thActions.textContent = 'الإجراءات';
      trHead.appendChild(thActions);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    filteredData.forEach((row, idx) => {
      const tr = document.createElement('tr');

      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = row[col] || '';
        td.style.padding = '10px';
        tr.appendChild(td);
      });

      if (tableId === 'btn-governorates') {
        const tdAreas = document.createElement('td');
        const areasBtn = document.createElement('button');
        areasBtn.className = 'btn btn-sm btn-info';
        areasBtn.textContent = '📍 عرض المناطق';
        areasBtn.onclick = () => openAreasModal(row);
        tdAreas.appendChild(areasBtn);
        tr.appendChild(tdAreas);
      }

      if (options.enableEditButton || options.enableDeleteButton) {
        const tdActions = document.createElement('td');

        if (options.enableEditButton && options.isEditEnabled(row, idx)) {
          const editBtn = document.createElement('button');
          editBtn.className = 'btn btn-sm btn-warning';
          editBtn.textContent = '✏️';
          editBtn.onclick = () => openEditDialog(idx);
          tdActions.appendChild(editBtn);
        }

        if (options.enableDeleteButton && options.isDeleteEnabled(row, idx)) {
          const delBtn = document.createElement('button');
          delBtn.className = 'btn btn-sm btn-danger';
          delBtn.textContent = '🗑️';
          delBtn.onclick = () => deleteRow(idx);
          tdActions.appendChild(delBtn);
        }

        tr.appendChild(tdActions);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function filterData(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filteredData = [...data];
    } else {
      filteredData = data.filter(row =>
        columns.some(col =>
          (row[col] || '').toString().toLowerCase().includes(q)
        )
      );
    }
    render();
  }

  function openAddDialog() {
    const modal = document.getElementById('addModal');
    const title = document.getElementById('addModalTitle');
    const body = document.getElementById('addModalBody');

    body.innerHTML = '';

    if (tableId === 'btn-governorates') {
      title.textContent = 'إضافة محافظة جديدة';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'اسم المحافظة';
      nameInput.className = 'form-control';
      nameInput.id = 'newGovernorateName';
      body.appendChild(nameInput);
    } else {
      title.textContent = 'إضافة عنصر جديد';
      columns.forEach(col => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = col;
        input.className = 'form-control';
        input.dataset.col = col;
        body.appendChild(input);
      });
    }

    modal.style.display = 'block';
  }

  function saveNewItem() {
    let newData = {};
    if (tableId === 'btn-governorates') {
      const nameInput = document.getElementById('newGovernorateName');
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        showAddModalNotification('❌ يرجى إدخال اسم المحافظة', true);
        return;
      }
      newData['الاسم'] = nameValue;
      newData['المناطق'] = [];
    } else {
      const inputs = document.querySelectorAll('#addModalBody input');
      inputs.forEach(input => {
        newData[input.dataset.col] = input.value.trim();
      });
    }

    data.push(newData);
    filteredData = [...data];
    render();
    closeAreasModal();
    showAddModalNotification('✅ تمت الإضافة بنجاح!');
  }

  function openEditDialog(idx) {
    openDialog('تعديل العنصر', data[idx], (newData) => {
      data[idx] = newData;
      filteredData = [...data];
      render();
    });
  }

  function deleteRow(idx) {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      data.splice(idx, 1);
      filteredData = [...data];
      render();
    }
  }

  function openDialog(title, currentData, onSave) {
    let newData = {};
    for (const col of columns) {
      let val = prompt(`${title} - ${col}`, currentData[col] || '');
      if (val === null) return;
      newData[col] = val.trim();
    }
    onSave(newData);
  }

  function openAreasModal(governorateRow) {
    currentGovernorateForModal = governorateRow;
    const modal = document.getElementById('areasModal');
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const tableBody = document.getElementById('areasTable').querySelector('tbody');

    title.textContent = `المناطق الخاصة بـ ${governorateRow['الاسم']}`;
    tableBody.innerHTML = '';

    const areas = governorateRow['المناطق'] || [];

    areas.forEach((area, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${area['الاسم']}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="editArea(${idx})">✏️ تعديل</button>
          <button class="btn btn-sm btn-danger" onclick="deleteArea(${idx})">🗑️ حذف</button>
        </td>`;
      tableBody.appendChild(tr);
    });

    modal.style.display = 'block';
    overlay.style.display = 'block';
  }

  function showAddModalNotification(message, isError = false) {
    const notif = document.getElementById('addModalNotification');
    notif.textContent = message;
    notif.style.backgroundColor = isError ? '#dc3545' : '#28a745';
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 3000);
  }

  // ✅ Functions for Areas inside modal
  window.editArea = function (idx) {
    const area = currentGovernorateForModal['المناطق'][idx];
    const newName = prompt('أدخل الاسم الجديد للمنطقة:', area['الاسم']);
    if (newName !== null) {
      area['الاسم'] = newName;
      openAreasModal(currentGovernorateForModal);
    }
  };

  window.deleteArea = function (idx) {
    if (confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      currentGovernorateForModal['المناطق'].splice(idx, 1);
      openAreasModal(currentGovernorateForModal);
    }
  };

  window.addNewArea = function () {
    const newName = prompt('أدخل اسم المنطقة الجديدة:');
    if (newName) {
      currentGovernorateForModal['المناطق'] = currentGovernorateForModal['المناطق'] || [];
      currentGovernorateForModal['المناطق'].push({ 'الاسم': newName });
      openAreasModal(currentGovernorateForModal);
    }
  };

  render();

  return {
    render,
    filterData,
    openAddDialog,
    saveNewItem,
    openEditDialog,
    deleteRow
  };
}

function closeAreasModal() {
  const modal = document.getElementById('areasModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal) modal.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
}

function closeAddModal() {
const modal = document.getElementById('addModal');
if (modal) {
  modal.style.display = 'none';
}
} 




// APIS

function fetchAllGovernorates() {
    return fetch('http://127.0.0.1:5000/get-all-governorates', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('API Error: ' + response.status);
        }
        return response.json();
    });
}