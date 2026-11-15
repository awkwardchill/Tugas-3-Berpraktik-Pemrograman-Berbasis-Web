/* ===========================
   LOAD TEMPLATE
=========================== */

async function loadTemplate(path) {

    const response =
        await fetch(path);

    const html =
        await response.text();

    document.body.insertAdjacentHTML(
        'beforeend',
        html
    );

}

/* ===========================
   LOAD ALL TEMPLATE
=========================== */

async function loadAllTemplates() {

    await loadTemplate(
        './templates/status-badge.html'
    );

    await loadTemplate(
        './templates/app-modal.html'
    );

    await loadTemplate(
        './templates/stock-table.html'
    );

    await loadTemplate(
        './templates/order-form.html'
    );

    await loadTemplate(
        './templates/do-tracking.html'
    );

}

/* ===========================
   START APPLICATION
=========================== */

(async function () {

    await loadAllTemplates();

    const data =
        await ApiService.getData();

    if (!data) return;

   /* =========================== VUE FILTERS =========================== */
Vue.filter('rupiah', function (value) {
  if (value === null || value === undefined) return 'Rp 0';
  return 'Rp ' + Number(value).toLocaleString('id-ID');
});

Vue.filter('satuanBuah', function (value) {
  if (value === null || value === undefined) return '0 buah';
  return value + ' buah';
});

Vue.filter('tanggalIndo', function (value) {
  if (!value) return '-';
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
});

    new Vue({

        el: '#app',

        data: {

            tab: 'stok',

            upbjjList:
                data.upbjjList,

            kategoriList:
                data.kategoriList,

            pengirimanList:
                data.pengirimanList,

            paketList:
                data.paket,

            stok:
                data.stok.map(item => ({
                    ...item,
                    edit: false
                })),

            trackingList:
                data.tracking || {}

        },
        methods: {

        // ✅ Gunakan Vue.set agar reaktif
        tambahDO(nomor, data) {
            Vue.set(this.trackingList, nomor, data);
        }

    }

    });

})();