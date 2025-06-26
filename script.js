// تهيئة الموقع عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التمرير السلس
    initSmoothScrolling();
    
    // تهيئة النماذج
    initForms();
    
    // تهيئة الإشعارات
    initNotifications();
    
    // تحديث التاريخ الحالي في نماذج التاريخ
    updateDateInputs();
});

// التمرير السلس للروابط
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// تهيئة النماذج
function initForms() {
    // نموذج طلب التجربة
    const experimentForm = document.getElementById('experimentForm');
    if (experimentForm) {
        experimentForm.addEventListener('submit', handleExperimentSubmit);
    }
}

// معالجة إرسال نموذج طلب التجربة
function handleExperimentSubmit(e) {
    e.preventDefault();
    
    const formData = {
        teacherName: document.getElementById('teacherName').value,
        subject: document.getElementById('subject').value,
        gradeLevel: document.getElementById('gradeLevel').value,
        studentCount: document.getElementById('studentCount').value,
        experimentDate: document.getElementById('experimentDate').value,
        experimentTime: document.getElementById('experimentTime').value,
        experimentName: document.getElementById('experimentName').value,
        experimentNotes: document.getElementById('experimentNotes').value
    };
    
    // التحقق من صحة البيانات
    if (validateExperimentForm(formData)) {
        // حفظ البيانات محلياً
        saveExperimentRequest(formData);
        
        // عرض رسالة نجاح
        showSuccessMessage('تم إرسال طلب التجربة بنجاح! سيتم مراجعته من قبل اختصاصية المختبر.');
        
        // إعادة تعيين النموذج
        document.getElementById('experimentForm').reset();
        
        // تحديث الجدول
        updateScheduleTable();
    }
}

// التحقق من صحة نموذج طلب التجربة
function validateExperimentForm(data) {
    const errors = [];
    
    if (!data.teacherName.trim()) {
        errors.push('اسم المعلمة مطلوب');
    }
    
    if (!data.subject) {
        errors.push('المادة العلمية مطلوبة');
    }
    
    if (!data.gradeLevel) {
        errors.push('الصف مطلوب');
    }
    
    if (!data.studentCount || data.studentCount < 1 || data.studentCount > 30) {
        errors.push('عدد الطلاب يجب أن يكون بين 1 و 30');
    }
    
    if (!data.experimentDate) {
        errors.push('تاريخ التجربة مطلوب');
    } else {
        const selectedDate = new Date(data.experimentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('تاريخ التجربة يجب أن يكون في المستقبل');
        }
    }
    
    if (!data.experimentTime) {
        errors.push('وقت التجربة مطلوب');
    }
    
    if (!data.experimentName.trim()) {
        errors.push('اسم التجربة مطلوب');
    }
    
    if (errors.length > 0) {
        showErrorMessage('يرجى تصحيح الأخطاء التالية:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// حفظ طلب التجربة محلياً
function saveExperimentRequest(data) {
    let requests = JSON.parse(localStorage.getItem('experimentRequests') || '[]');
    
    const request = {
        id: Date.now(),
        ...data,
        status: 'pending',
        requestDate: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    requests.push(request);
    localStorage.setItem('experimentRequests', JSON.stringify(requests));
}

// فتح النماذج المختلفة
function openForm(formType) {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    const modalTitle = document.getElementById('formModalTitle');
    const modalBody = document.getElementById('formModalBody');
    
    let title = '';
    let content = '';
    
    switch(formType) {
        case 'commitment':
            title = 'تعهد خلو المختبرات من المواد الكيميائية منتهية الصلاحية';
            content = getCommitmentForm();
            break;
        case 'assets':
            title = 'نموذج نقل الأصول';
            content = getAssetsForm();
            break;
        case 'chemicals':
            title = 'نموذج حصر المواد الكيميائية';
            content = getChemicalsForm();
            break;
        case 'furniture':
            title = 'تقرير حالة أثاث المختبرات';
            content = getFurnitureForm();
            break;
        case 'plan':
            title = 'الخطة التشغيلية للمختبر';
            content = getPlanForm();
            break;
        case 'weekly':
            title = 'الجدول الأسبوعي';
            content = getWeeklyForm();
            break;
        default:
            title = 'النموذج';
            content = '<p>النموذج غير متوفر حالياً.</p>';
    }
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.show();
}

// نموذج تعهد خلو المختبرات
function getCommitmentForm() {
    return `
        <form id="commitmentForm">
            <h6 class="fw-bold mb-3">أولاً: بيانات المدرسة</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">اسم المدرسة</label>
                    <input type="text" class="form-control" name="schoolName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">رمز المدرسة</label>
                    <input type="text" class="form-control" name="schoolCode" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">المرحلة الدراسية</label>
                    <select class="form-select" name="educationLevel" required>
                        <option value="">اختر المرحلة</option>
                        <option value="الحلقة الأولى">الحلقة الأولى</option>
                        <option value="الحلقة الثانية">الحلقة الثانية</option>
                        <option value="الحلقة الثالثة">الحلقة الثالثة</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">الفرع المدرسي / الإمارة</label>
                    <input type="text" class="form-control" name="branch" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">اسم المدير</label>
                    <input type="text" class="form-control" name="principalName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">رقم الهاتف</label>
                    <input type="tel" class="form-control" name="phone" required>
                </div>
                <div class="col-12">
                    <label class="form-label">البريد الإلكتروني</label>
                    <input type="email" class="form-control" name="email" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">ثانياً: بيانات اختصاصي المختبرات العلمية</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">الاسم</label>
                    <input type="text" class="form-control" name="specialistName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">المسمى الوظيفي</label>
                    <input type="text" class="form-control" name="jobTitle" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">البريد الإلكتروني</label>
                    <input type="email" class="form-control" name="specialistEmail" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">رقم الهاتف</label>
                    <input type="tel" class="form-control" name="specialistPhone" required>
                </div>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ التعهد
                </button>
            </div>
        </form>
    `;
}

// نموذج نقل الأصول
function getAssetsForm() {
    return `
        <form id="assetsForm">
            <h6 class="fw-bold mb-3">بيانات العملية</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">العملية المطلوبة</label>
                    <select class="form-select" name="operationType" required>
                        <option value="">اختر العملية</option>
                        <option value="نقل دائم">نقل دائم</option>
                        <option value="نقل مؤقت">نقل مؤقت</option>
                        <option value="استعارة">استعارة</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">سبب العملية</label>
                    <input type="text" class="form-control" name="reason" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">تفاصيل الأصول</h6>
            <div id="assetsContainer">
                <div class="asset-item border p-3 mb-3 rounded">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">اسم/وصف الأصل</label>
                            <input type="text" class="form-control" name="assetName[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">موقع الأصل</label>
                            <input type="text" class="form-control" name="assetLocation[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">حالة الأصل</label>
                            <select class="form-select" name="assetCondition[]" required>
                                <option value="">اختر الحالة</option>
                                <option value="جديد">جديد</option>
                                <option value="صالح">صالح</option>
                                <option value="تالف">تالف</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">الرقم التسلسلي</label>
                            <input type="text" class="form-control" name="serialNumber[]">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-3">
                <button type="button" class="btn btn-outline-primary" onclick="addAssetItem()">
                    <i class="fas fa-plus me-2"></i>
                    إضافة أصل آخر
                </button>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ النموذج
                </button>
            </div>
        </form>
    `;
}

// نموذج حصر المواد الكيميائية
function getChemicalsForm() {
    return `
        <form id="chemicalsForm">
            <h6 class="fw-bold mb-3">بيانات المختبر</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">نوع المختبر</label>
                    <select class="form-select" name="labType" required>
                        <option value="">اختر نوع المختبر</option>
                        <option value="كيمياء">كيمياء</option>
                        <option value="فيزياء">فيزياء</option>
                        <option value="أحياء">أحياء</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">التاريخ</label>
                    <input type="date" class="form-control" name="reportDate" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">المواد الكيميائية</h6>
            <div id="chemicalsContainer">
                <div class="chemical-item border p-3 mb-3 rounded">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">المادة الكيميائية</label>
                            <input type="text" class="form-control" name="chemicalName[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">حالة المادة</label>
                            <select class="form-select" name="chemicalStatus[]" required>
                                <option value="">اختر الحالة</option>
                                <option value="صالحة">صالحة</option>
                                <option value="منتهية الصلاحية">منتهية الصلاحية</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">التغليف</label>
                            <input type="text" class="form-control" name="packaging[]" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">العدد</label>
                            <input type="number" class="form-control" name="quantity[]" min="1" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">الوزن الإجمالي (كغ)</label>
                            <input type="number" class="form-control" name="weight[]" step="0.1" min="0" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">ملاحظات</label>
                            <textarea class="form-control" name="notes[]" rows="2"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-3">
                <button type="button" class="btn btn-outline-primary" onclick="addChemicalItem()">
                    <i class="fas fa-plus me-2"></i>
                    إضافة مادة أخرى
                </button>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ النموذج
                </button>
            </div>
        </form>
    `;
}

// نموذج تقرير حالة الأثاث
function getFurnitureForm() {
    return `
        <form id="furnitureForm">
            <h6 class="fw-bold mb-3">بيانات التقرير</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">نوع المختبر</label>
                    <select class="form-select" name="labType" required>
                        <option value="">اختر نوع المختبر</option>
                        <option value="كيمياء">كيمياء</option>
                        <option value="فيزياء">فيزياء</option>
                        <option value="أحياء">أحياء</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">تاريخ التقرير</label>
                    <input type="date" class="form-control" name="reportDate" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">الأثاث والتجهيزات</h6>
            <div id="furnitureContainer">
                <div class="furniture-item border p-3 mb-3 rounded">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">نوع الأثاث/التجهيزات</label>
                            <input type="text" class="form-control" name="furnitureType[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">العدد المطلوب</label>
                            <input type="number" class="form-control" name="requestedQuantity[]" min="1" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label">وصف الحالة الحالية</label>
                            <textarea class="form-control" name="currentCondition[]" rows="3" required></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label">صور الحالة الحالية</label>
                            <input type="file" class="form-control" name="conditionImages[]" accept="image/*" multiple>
                            <small class="text-muted">يمكن اختيار عدة صور</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-3">
                <button type="button" class="btn btn-outline-primary" onclick="addFurnitureItem()">
                    <i class="fas fa-plus me-2"></i>
                    إضافة عنصر آخر
                </button>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ التقرير
                </button>
            </div>
        </form>
    `;
}

// نموذج الخطة التشغيلية
function getPlanForm() {
    return `
        <form id="planForm">
            <h6 class="fw-bold mb-3">الهدف الاستراتيجي</h6>
            <div class="mb-4">
                <label class="form-label">الهدف الاستراتيجي</label>
                <textarea class="form-control" name="strategicGoal" rows="3" required></textarea>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">المؤشر</label>
                    <textarea class="form-control" name="indicator" rows="2" required></textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">تكلفة المؤشر</label>
                    <input type="number" class="form-control" name="indicatorCost" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                    <label class="form-label">تاريخ البدء</label>
                    <input type="date" class="form-control" name="startDate" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">تاريخ الانتهاء</label>
                    <input type="date" class="form-control" name="endDate" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">الإجراءات</h6>
            <div id="actionsContainer">
                <div class="action-item border p-3 mb-3 rounded">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label">وصف الإجراء</label>
                            <textarea class="form-control" name="actionDescription[]" rows="2" required></textarea>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">المسؤول</label>
                            <input type="text" class="form-control" name="responsiblePerson[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">وزن المهمة (%)</label>
                            <input type="number" class="form-control" name="taskWeight[]" min="1" max="100" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">تاريخ البدء</label>
                            <input type="date" class="form-control" name="actionStartDate[]" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">تاريخ الانتهاء</label>
                            <input type="date" class="form-control" name="actionEndDate[]" required>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-3">
                <button type="button" class="btn btn-outline-primary" onclick="addActionItem()">
                    <i class="fas fa-plus me-2"></i>
                    إضافة إجراء آخر
                </button>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ الخطة
                </button>
            </div>
        </form>
    `;
}

// نموذج الجدول الأسبوعي
function getWeeklyForm() {
    return `
        <form id="weeklyForm">
            <h6 class="fw-bold mb-3">بيانات الجدول</h6>
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label class="form-label">نوع المختبر</label>
                    <select class="form-select" name="labType" required>
                        <option value="">اختر نوع المختبر</option>
                        <option value="كيمياء">كيمياء</option>
                        <option value="فيزياء">فيزياء</option>
                        <option value="أحياء">أحياء</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">الأسبوع</label>
                    <input type="week" class="form-control" name="weekDate" required>
                </div>
            </div>
            
            <h6 class="fw-bold mb-3">جدولة الحصص</h6>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>الحصة</th>
                            <th>الاثنين</th>
                            <th>الثلاثاء</th>
                            <th>الأربعاء</th>
                            <th>الخميس</th>
                            <th>الجمعة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateScheduleRows()}
                    </tbody>
                </table>
            </div>
            
            <div class="text-center">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save me-2"></i>
                    حفظ الجدول
                </button>
            </div>
        </form>
    `;
}

// إنشاء صفوف جدول الحصص
function generateScheduleRows() {
    const periods = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    return periods.map((period, index) => {
        const dayInputs = days.map(day => 
            `<td><input type="text" class="form-control form-control-sm" name="${day}_${index + 1}" placeholder="الصف/المعلمة"></td>`
        ).join('');
        
        return `<tr><td class="fw-bold">${period}</td>${dayInputs}</tr>`;
    }).join('');
}

// إضافة عنصر أصل جديد
function addAssetItem() {
    const container = document.getElementById('assetsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'asset-item border p-3 mb-3 rounded';
    newItem.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">اسم/وصف الأصل</label>
                <input type="text" class="form-control" name="assetName[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">موقع الأصل</label>
                <input type="text" class="form-control" name="assetLocation[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">حالة الأصل</label>
                <select class="form-select" name="assetCondition[]" required>
                    <option value="">اختر الحالة</option>
                    <option value="جديد">جديد</option>
                    <option value="صالح">صالح</option>
                    <option value="تالف">تالف</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">الرقم التسلسلي</label>
                <input type="text" class="form-control" name="serialNumber[]">
            </div>
            <div class="col-12 text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeItem(this)">
                    <i class="fas fa-trash me-1"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

// إضافة مادة كيميائية جديدة
function addChemicalItem() {
    const container = document.getElementById('chemicalsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'chemical-item border p-3 mb-3 rounded';
    newItem.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">المادة الكيميائية</label>
                <input type="text" class="form-control" name="chemicalName[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">حالة المادة</label>
                <select class="form-select" name="chemicalStatus[]" required>
                    <option value="">اختر الحالة</option>
                    <option value="صالحة">صالحة</option>
                    <option value="منتهية الصلاحية">منتهية الصلاحية</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">التغليف</label>
                <input type="text" class="form-control" name="packaging[]" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">العدد</label>
                <input type="number" class="form-control" name="quantity[]" min="1" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">الوزن الإجمالي (كغ)</label>
                <input type="number" class="form-control" name="weight[]" step="0.1" min="0" required>
            </div>
            <div class="col-12">
                <label class="form-label">ملاحظات</label>
                <textarea class="form-control" name="notes[]" rows="2"></textarea>
            </div>
            <div class="col-12 text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeItem(this)">
                    <i class="fas fa-trash me-1"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

// إضافة عنصر أثاث جديد
function addFurnitureItem() {
    const container = document.getElementById('furnitureContainer');
    const newItem = document.createElement('div');
    newItem.className = 'furniture-item border p-3 mb-3 rounded';
    newItem.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">نوع الأثاث/التجهيزات</label>
                <input type="text" class="form-control" name="furnitureType[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">العدد المطلوب</label>
                <input type="number" class="form-control" name="requestedQuantity[]" min="1" required>
            </div>
            <div class="col-12">
                <label class="form-label">وصف الحالة الحالية</label>
                <textarea class="form-control" name="currentCondition[]" rows="3" required></textarea>
            </div>
            <div class="col-12">
                <label class="form-label">صور الحالة الحالية</label>
                <input type="file" class="form-control" name="conditionImages[]" accept="image/*" multiple>
                <small class="text-muted">يمكن اختيار عدة صور</small>
            </div>
            <div class="col-12 text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeItem(this)">
                    <i class="fas fa-trash me-1"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

// إضافة إجراء جديد
function addActionItem() {
    const container = document.getElementById('actionsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'action-item border p-3 mb-3 rounded';
    newItem.innerHTML = `
        <div class="row g-3">
            <div class="col-12">
                <label class="form-label">وصف الإجراء</label>
                <textarea class="form-control" name="actionDescription[]" rows="2" required></textarea>
            </div>
            <div class="col-md-6">
                <label class="form-label">المسؤول</label>
                <input type="text" class="form-control" name="responsiblePerson[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">وزن المهمة (%)</label>
                <input type="number" class="form-control" name="taskWeight[]" min="1" max="100" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">تاريخ البدء</label>
                <input type="date" class="form-control" name="actionStartDate[]" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">تاريخ الانتهاء</label>
                <input type="date" class="form-control" name="actionEndDate[]" required>
            </div>
            <div class="col-12 text-end">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeItem(this)">
                    <i class="fas fa-trash me-1"></i>
                    حذف
                </button>
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

// حذف عنصر
function removeItem(button) {
    const item = button.closest('.asset-item, .chemical-item, .furniture-item, .action-item');
    if (item) {
        item.remove();
    }
}

// تحديث حقول التاريخ
function updateDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        if (!input.value) {
            input.min = today;
        }
    });
}

// تحديث جدول الحصص
function updateScheduleTable() {
    // هذه الوظيفة يمكن تطويرها لتحديث الجدول بناءً على الطلبات المحفوظة
    console.log('تحديث جدول الحصص...');
}

// عرض رسالة نجاح
function showSuccessMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// عرض رسالة خطأ
function showErrorMessage(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message.replace(/\n/g, '<br>')}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 8000);
}

// تهيئة الإشعارات
function initNotifications() {
    // يمكن إضافة منطق الإشعارات هنا
    console.log('تهيئة نظام الإشعارات...');
}

// معالجة إرسال النماذج المختلفة
document.addEventListener('submit', function(e) {
    if (e.target.id === 'commitmentForm') {
        e.preventDefault();
        handleCommitmentSubmit(e.target);
    } else if (e.target.id === 'assetsForm') {
        e.preventDefault();
        handleAssetsSubmit(e.target);
    } else if (e.target.id === 'chemicalsForm') {
        e.preventDefault();
        handleChemicalsSubmit(e.target);
    } else if (e.target.id === 'furnitureForm') {
        e.preventDefault();
        handleFurnitureSubmit(e.target);
    } else if (e.target.id === 'planForm') {
        e.preventDefault();
        handlePlanSubmit(e.target);
    } else if (e.target.id === 'weeklyForm') {
        e.preventDefault();
        handleWeeklySubmit(e.target);
    }
});

// معالجة نموذج التعهد
function handleCommitmentSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // حفظ البيانات محلياً
    let commitments = JSON.parse(localStorage.getItem('commitments') || '[]');
    commitments.push({
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('commitments', JSON.stringify(commitments));
    
    showSuccessMessage('تم حفظ التعهد بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

// معالجة نموذج الأصول
function handleAssetsSubmit(form) {
    const formData = new FormData(form);
    
    // حفظ البيانات محلياً
    let assets = JSON.parse(localStorage.getItem('assetTransfers') || '[]');
    assets.push({
        id: Date.now(),
        formData: Object.fromEntries(formData.entries()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('assetTransfers', JSON.stringify(assets));
    
    showSuccessMessage('تم حفظ نموذج نقل الأصول بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

// معالجة نموذج المواد الكيميائية
function handleChemicalsSubmit(form) {
    const formData = new FormData(form);
    
    // حفظ البيانات محلياً
    let chemicals = JSON.parse(localStorage.getItem('chemicalInventory') || '[]');
    chemicals.push({
        id: Date.now(),
        formData: Object.fromEntries(formData.entries()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('chemicalInventory', JSON.stringify(chemicals));
    
    showSuccessMessage('تم حفظ نموذج حصر المواد الكيميائية بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

// معالجة نموذج الأثاث
function handleFurnitureSubmit(form) {
    const formData = new FormData(form);
    
    // حفظ البيانات محلياً
    let furniture = JSON.parse(localStorage.getItem('furnitureReports') || '[]');
    furniture.push({
        id: Date.now(),
        formData: Object.fromEntries(formData.entries()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('furnitureReports', JSON.stringify(furniture));
    
    showSuccessMessage('تم حفظ تقرير حالة الأثاث بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

// معالجة نموذج الخطة التشغيلية
function handlePlanSubmit(form) {
    const formData = new FormData(form);
    
    // حفظ البيانات محلياً
    let plans = JSON.parse(localStorage.getItem('operationalPlans') || '[]');
    plans.push({
        id: Date.now(),
        formData: Object.fromEntries(formData.entries()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('operationalPlans', JSON.stringify(plans));
    
    showSuccessMessage('تم حفظ الخطة التشغيلية بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

// معالجة نموذج الجدول الأسبوعي
function handleWeeklySubmit(form) {
    const formData = new FormData(form);
    
    // حفظ البيانات محلياً
    let schedules = JSON.parse(localStorage.getItem('weeklySchedules') || '[]');
    schedules.push({
        id: Date.now(),
        formData: Object.fromEntries(formData.entries()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('weeklySchedules', JSON.stringify(schedules));
    
    showSuccessMessage('تم حفظ الجدول الأسبوعي بنجاح!');
    bootstrap.Modal.getInstance(document.getElementById('formModal')).hide();
}

