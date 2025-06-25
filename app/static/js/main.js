const url_base = "https://solar-solution.onrender.com"
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
      'num': (index + 1).toString(),
      'name': gov.Name
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

// navigation

function showAddModalNotification(message, isError = false) {
  // Remove existing notification if any
  const existingNotification = document.getElementById('addModalNotification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification container
  const notification = document.createElement('div');
  notification.id = 'addModalNotification';
  notification.textContent = message;

  // Base styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '-400px',  // Start hidden outside viewport (for animation)
    maxWidth: '300px',
    padding: '15px 20px',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
    zIndex: 10000,
    transition: 'right 0.5s ease, opacity 0.5s ease',
    opacity: '0.9'
  });

  // Color based on type
  if (isError) {
    notification.style.backgroundColor = '#dc3545'; // Bootstrap danger
  } else {
    notification.style.backgroundColor = '#28a745'; // Bootstrap success
  }

  // Append to body
  document.body.appendChild(notification);

  // Trigger slide-in animation
  setTimeout(() => {
    notification.style.right = '20px';
  }, 50);

  // Auto hide after 4 seconds
  setTimeout(() => {
    notification.style.right = '-400px';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500); // Remove from DOM after animation
  }, 4000);
}


// controller

function createTableController(containerId, tableId, config) {
  let currentGovernorateForModal = null;
  const container = document.getElementById(containerId);
  if (!container) throw new Error('Container not found');

  const columns = config.columns || [];
  const columnKeyMap = config.columnKeyMap || [];
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
  console.log("filteredData", filteredData);

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
      thActions.style.width = '20%';
      thActions.textContent = 'الإجراءات';
      trHead.appendChild(thActions);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    filteredData.forEach((row, idx) => {
      console.log(`row ${row.id}`);
      const tr = document.createElement('tr');

      columns.forEach(col => {
        const td = document.createElement('td');
        const key = columnKeyMap[col];  // نحصل على المفتاح الصحيح مثل 'name' أو 'num'
        td.textContent = row[key] || '';
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
          editBtn.style.marginLeft = '10px';
          editBtn.onclick = () => openEditDialog(idx);
          tdActions.appendChild(editBtn);
        }

        if (options.enableDeleteButton && options.isDeleteEnabled(row)) {
          const delBtn = document.createElement('button');
          delBtn.className = 'btn btn-sm btn-danger';
          delBtn.textContent = '🗑️';
          delBtn.style.marginRight = '10px';
          delBtn.onclick = () => deleteRow(row.id, row.name);
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
      // ✅ Modal Title
      title.textContent = 'إضافة محافظة جديدة';

      // ✅ Input Wrapper
      const inputWrapper = document.createElement('div');
      inputWrapper.style.marginBottom = '20px';
      inputWrapper.style.display = 'flex';
      inputWrapper.style.flexDirection = 'column';
      inputWrapper.style.alignItems = 'stretch';

      // ✅ Governorate Name Input
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'اسم المحافظة';
      nameInput.id = 'newGovernorateName';
      Object.assign(nameInput.style, {
        padding: '15px 20px',
        fontSize: '1.2rem',
        borderRadius: '8px',
        border: '2px solid #007BFF',
        outline: 'none',
        transition: 'border-color 0.3s ease'
      });

      nameInput.addEventListener('focus', () => {
        nameInput.style.borderColor = '#0056b3';
        nameInput.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.5)';
      });
      nameInput.addEventListener('blur', () => {
        nameInput.style.borderColor = '#007BFF';
        nameInput.style.boxShadow = 'none';
      });

      inputWrapper.appendChild(nameInput);

      // ✅ Buttons Container
      const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'flex-end';
        buttonsContainer.style.flexDirection = 'row-reverse';  // ✅ Right to left
        buttonsContainer.style.gap = '10px';
        buttonsContainer.style.marginTop = '15px';

      // ✅ Save Button
      const saveBtn = document.createElement('button');
      saveBtn.textContent = '✅ حفظ المحافظة';
      Object.assign(saveBtn.style, {
        backgroundColor: '#28a745',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
      });

      saveBtn.addEventListener('mouseover', () => {
        saveBtn.style.backgroundColor = '#218838';
        saveBtn.style.boxShadow = '0 6px 12px rgba(33, 136, 56, 0.5)';
      });
      saveBtn.addEventListener('mouseout', () => {
        saveBtn.style.backgroundColor = '#28a745';
        saveBtn.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
      });

      saveBtn.onclick = async () => {
        const nameValue = nameInput.value.trim();
        if (!nameValue) {
          showAddModalNotification('❌ يرجى إدخال اسم المحافظة', true);
          return;
        }

        try {
          const result = await addGovernorate(nameValue);

          showAddModalNotification('✅ تمت الإضافة بنجاح!');
          closeAddModal();

          // ✅ Fetch latest governorates from API
          const freshGovernorates = await fetchAllGovernorates();

          // ✅ Format data for your table
          data = freshGovernorates.map((gov, index) => ({
            'num': (index + 1).toString(),
            'name': gov.Name,
            'id': gov.Id,
            'المناطق': []  // Optional: If you want to include regions later
          }));

          filteredData = [...data];

          // ✅ Re-render the table
          render();

        } catch (error) {
          console.error('❌ خطأ في حفظ المحافظة:', error);
          showAddModalNotification('❌ حدث خطأ أثناء الحفظ', true);
        }
      };

      // ✅ Cancel Button
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌ إلغاء';
      Object.assign(cancelBtn.style, {
        backgroundColor: '#dc3545',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1rem',
        padding: '10px 18px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
      });

      cancelBtn.addEventListener('mouseover', () => {
        cancelBtn.style.backgroundColor = '#c82333';
        cancelBtn.style.boxShadow = '0 6px 12px rgba(200, 35, 51, 0.5)';
      });
      cancelBtn.addEventListener('mouseout', () => {
        cancelBtn.style.backgroundColor = '#dc3545';
        cancelBtn.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
      });

      cancelBtn.onclick = () => {
        closeAddModal();
      };

      // ✅ Append buttons to container
      buttonsContainer.appendChild(cancelBtn);
      buttonsContainer.appendChild(saveBtn);

      // ✅ Final Append
      inputWrapper.appendChild(buttonsContainer);
      body.appendChild(inputWrapper);
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

  async function deleteRow(id, item_name) {
    const idx = data.findIndex(item => item.id === id);
    if (idx === -1) {
      console.error('العنصر غير موجود في data بالمعرّف:', id);
      return;
    }
      console.log(item_name);
    const result = await Swal.fire({
      title: ` هل أنت متأكد من حذف محافظة ${item_name} ؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteGovernorate(id);
      console.log(response);

      data.splice(idx, 1);
      filteredData = [...data];
      render();

      showAddModalNotification(`${item_name} تم حذف محافظة`);

    } catch (error) {
      showAddModalNotification('حدث خطأ أثناء حذف العنصر', 'فشل الحذف', true);
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
    // return fetch('https://solar-solution.onrender.com/get-all-governorates', {
    return fetch(`${url_base}/get-all-governorates`, {
      method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('API Error: ' + response.status);
        }
        return response.json();
    });
}

async function RefershGovernorates(){
  try {
    const response = await fetch(`${url_base}/get-all-governorates`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error fetching client messages by region:', error);
    throw error;
  }
}

async function addClientMessage(messageData) {
  // messageData example:
  // { full_name, email, phone, message, region_id, house_number }
  try {
    const response = await fetch(`${url_base}/add-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error adding client message:', error);
    throw error;
  }
}

async function getClientMessagesByRegion(regionId) {
  try {
    const response = await fetch(`${url_base}/get-client-messages?region_id=${encodeURIComponent(regionId)}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error fetching client messages by region:', error);
    throw error;
  }
}


async function getAllClientMessages() {
  try {
    const response = await fetch(`${url_base}/get-all-client-messages`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error fetching all client messages:', error);
    throw error;
  }
}


async function deleteClientMessage(messageId) {
  try {
    const response = await fetch(`${url_base}/delete-client-message/${messageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error deleting client message:', error);
    throw error;
  }
}


async function updateClientMessage(messageId, messageData) {
  // messageData example:
  // { full_name, email, phone, message, region_id, house_number }
  try {
    const response = await fetch(`${url_base}/update-client-message/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error updating client message:', error);
    throw error;
  }
}


async function addGovernorate(name) {
  try {
    const response = await fetch(`${url_base}/add-governorate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error adding governorate:', error);
    throw error;
  }
}

async function deleteGovernorate(governorateId) {
  try {
    const response = await fetch(`${url_base}/delete-governorate/${governorateId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('خطأ من الـ API: ' + response.status);
    }

    const jsonData = await response.json();
    return jsonData, response.status;

  } catch (error) {
    console.error('حدث خطأ أثناء الحذف:', error);
    throw error;
  }
}

async function updateGovernorate(governorateId, name) {
  try {
    const response = await fetch(`${url_base}/update-governorate/${governorateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error updating governorate:', error);
    throw error;
  }
}


async function addRegion(name, governorateId) {
  try {
    const response = await fetch(`${url_base}/add-region`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, governorate_id: governorateId }),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error adding region:', error);
    throw error;
  }
}


async function getRegionsByGovernorate(governorateId) {
  try {
    const response = await fetch(`${url_base}/get-regions-by-governorate/${governorateId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error fetching regions by governorate:', error);
    throw error;
  }
}


async function deleteRegion(regionId) {
  try {
    const response = await fetch(`${url_base}/delete-region/${regionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
}


async function updateRegion(regionId, name, governorateId) {
  try {
    const response = await fetch(`${url_base}/tupdate-region/${regionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, governorate_id: governorateId }),
    });
    if (!response.ok) throw new Error('API error: ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
}

