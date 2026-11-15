Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  props: {
    trackingList: Object
  },
  data() {
    return {
      searchQuery: '',
      activeSearch: ''
    };
  },
  computed: {
    filteredTracking() {
      if (!this.activeSearch) return this.trackingList;
      const q = this.activeSearch.toLowerCase().trim();
      const result = {};
      Object.keys(this.trackingList).forEach(key => {
        const item = this.trackingList[key];
        if (
          key.toLowerCase().includes(q) ||
          (item.nim && item.nim.toLowerCase().includes(q))
        ) {
          result[key] = item;
        }
      });
      return result;
    }
  },
  methods: {
    submitSearch() {
      this.activeSearch = this.searchQuery;
    },
    resetSearch() {
      this.searchQuery = '';
      this.activeSearch = '';
    },
    tambahPerjalanan(nomorDO) {
      Swal.fire({
        title: `Tambah Progress (${nomorDO})`,
        input: 'text',
        inputLabel: 'Keterangan Status Pengiriman',
        inputPlaceholder: 'Contoh: Paket tiba di Hub Jakarta',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        inputValidator: (value) => {
          if (!value) return 'Keterangan tidak boleh kosong!';
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const now = new Date();
          const waktu = now.toISOString().slice(0, 19).replace('T', ' ');
          this.trackingList[nomorDO].perjalanan.push({
            waktu: waktu,
            keterangan: result.value
          });
          Swal.fire('Berhasil', 'Progress perjalanan ditambahkan', 'success');
        }
      });
    },
    showPerjalanan(item) {
      let isi = '';
      item.perjalanan.forEach((p, i) => {
        isi += `
          <div style="margin-bottom:15px; padding:12px; border-radius:8px; background:#f4f6f9; border-left:5px solid #3498db;">
            <div style="font-weight:bold;">Step ${i + 1}</div>
            <div style="font-size:12px; color:#666; margin:4px 0;">${p.waktu}</div>
            <div>${p.keterangan}</div>
          </div>`;
      });

      Swal.fire({
        title: `Tracking ${item.paket}`,
        html: isi,
        width: 600,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#3085d6'
      });
    }
  }
});