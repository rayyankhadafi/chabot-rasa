from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import textwrap


# =========================================================
# ===================== HELPER ============================
# =========================================================

def clean_response(text: str) -> str:
    return textwrap.dedent(text).strip()


def has_keyword(text: str, keywords: list) -> bool:
    return any(keyword in text for keyword in keywords)


# =========================================================
# ==================== RESPONSES ==========================
# =========================================================

RESPONSES = {

    # ================= INHAL =================

    "inhal_cara": """
        Jika mahasiswa tidak mengikuti praktikum, maka tidak akan mendapatkan nilai pada pertemuan 
        tersebut. Namun, mahasiswa masih dapat mengikuti inhal untuk memperoleh nilai pengganti
        sesuai ketentuan laboratorium.

        Ketentuan inhal umumnya:
        - Biaya inhal sekitar Rp25.000 per pertemuan
        - Mahasiswa dengan izin resmi, seperti sakit atau musibah, biasanya dapat mengikuti inhal tanpa
          biaya

        Prosedur pembayaran inhal:
        - Hubungi Pak Agung Purnomo melalui WhatsApp
        - Lakukan pendataan dan pembayaran sesuai arahan
        - Kirim bukti transfer untuk verifikasi
        - Setelah terverifikasi, mahasiswa dapat mengikuti inhal sesuai jadwal dari asisten praktikum
    """,

    "inhal_default": """
        Untuk informasi dan ketentuan inhal praktikum, kamu dapat menanyakannya langsung kepada asisten
        praktikum atau laboran.

        Dengan begitu, kamu bisa mendapatkan informasi yang lebih jelas mengenai syarat, jadwal, dan
        prosedur mengikuti inhal.
    """,

    # ================= JADWAL =================

    "jadwal_pindah": """
        Pindah atau mengubah jadwal praktikum biasanya dapat dilakukan, terutama jika terdapat bentrok
        dengan jadwal kuliah atau praktikum lain.

        Berikut beberapa ketentuan umum terkait pindah jadwal praktikum:
        - Mahasiswa sudah terdaftar pada salah satu slot praktikum
        - Perpindahan jadwal biasanya dilakukan setelah masa pemilihan slot selesai
        - Pengajuan pindah jadwal dapat dilakukan melalui laboran atau sistem registrasi laboratorium
        - Informasi dan jadwal layanan bentrok biasanya diumumkan melalui website atau Grup Whatsapp
        dan Telegram resmi laboratorium

        Pastikan kamu selalu memantau informasi terbaru dari laboratorium agar tidak melewatkan jadwal
        pengajuan pindah slot praktikum.
    """,

    "jadwal_default": """
        Jadwal praktikum biasanya diumumkan oleh asisten praktikum
        atau laboratorium sebelum praktikum dimulai.

        Mahasiswa dapat melihat jadwal praktikum
        melalui website Reglab TIF UAD atau grup praktikum.
    """,

    # ================= ATURAN =================

    "aturan_hp": """
        Penggunaan HP saat praktikum umumnya diperbolehkan selama tidak mengganggu jalannya praktikum
        dan tetap mengikuti arahan asisten praktikum.

        Namun, pada beberapa mata kuliah atau sesi praktikum tertentu, penggunaan HP bisa saja dibatasi
        atau tidak diperbolehkan.
        Karena itu, pastikan kamu mengikuti ketentuan yang telah ditetapkan oleh asisten laboratorium
        pada praktikum tersebut.
    """,

    "aturan_browser": """
        Penggunaan browser saat praktikum umumnya diperbolehkan untuk kebutuhan praktikum,
        seperti membuka dokumentasi atau mengakses localhost.
        Namun, saat pelaksanaan post-test atau evaluasi tertentu, beberapa praktikum dapat membatasi
        penggunaan browser sesuai aturan dari asisten laboratorium.

        Selain itu, penggunaan layanan AI seperti ChatGPT
        atau tools AI lainnya biasanya tidak diperbolehkan jika tidak ada izin dari asisten praktikum.
    """,

    "aturan_kerjasama": """
        Mahasiswa diharapkan mengerjakan praktikum secara mandiri,
        kecuali jika terdapat ketentuan kerja kelompok dari asisten praktikum.
    """,

    "aturan_default": """
        Aturan praktikum di Informatika UAD dibuat untuk menjaga ketertiban dan kelancaran kegiatan
        praktikum di laboratorium.
        Berikut beberapa ketentuan umum praktikum:

        1. Pendaftaran dan Administrasi
        Mahasiswa wajib melakukan KRS mata kuliah terlebih dahulu sebelum mendaftar praktikum
        Pendaftaran praktikum dilakukan melalui sistem registrasi laboratorium (REGLAB)
        2. Tata Tertib Praktikum
        -Mahasiswa wajib hadir sesuai jadwal praktikum yang telah ditentukan
        -Tidak diperbolehkan mengubah pengaturan software atau hardware komputer laboratorium tanpa
         izin asisten atau laboran
        -Praktikan harus menjaga ketertiban selama kegiatan praktikum berlangsung
        -Orang yang tidak berkepentingan tidak diperbolehkan berada di ruang laboratorium saat
         praktikum berlangsung
        3. Sanksi Pelanggaran
        Pelanggaran tata tertib dapat dikenakan sanksi sesuai aturan laboratorium atau fakultas

        Pastikan kamu selalu mengikuti arahan dari asisten praktikum dan memantau informasi terbaru
        dari laboratorium.
    """,

    # ================= KEHADIRAN =================

    "kehadiran_rules": """
        Jika tidak dapat menghadiri praktikum, mahasiswa sebaiknya segera menghubungi asisten
        praktikum dan memberikan alasan serta bukti yang jelas, seperti surat sakit, musibah, atau
        surat izin dari kampus.

        Jika alasan atau bukti yang diberikan tidak dapat diverifikasi, maka mahasiswa biasanya akan
        dianggap tidak hadir (alfa).

        Selain itu, toleransi keterlambatan praktikum umumnya maksimal 15 menit. Jika melebihi batas
        tersebut, mahasiswa biasanya tidak diperbolehkan mengikuti praktikum dan akan dianggap alfa,
        sehingga tidak mendapatkan nilai pada pertemuan tersebut.

        Namun, mahasiswa masih dapat mengikuti inhall sesuai ketentuan laboratorium untuk memperoleh
        nilai pengganti akibat ketidakhadiran praktikum.

        Jadi, pastikan kamu selalu hadir tepat waktu dan mengikuti seluruh ketentuan praktikum ya.
    """,

    "kehadiran_minimal": """
        Minimal kehadiran praktikum umumnya adalah 11 kali pertemuan.

        Jika mahasiswa tidak memenuhi batas minimal kehadiran atau tidak hadir lebih dari 3 kali,
        maka mahasiswa biasanya akan dianggap tidak memenuhi syarat mengikuti praktikum atau
        responsi dan tercatat alfa pada pertemuancyang ditinggalkan.
    """,

    "kehadiran_default": """
        Mahasiswa wajib memenuhi minimal kehadiran praktikum agar tetap dapat mengikuti evaluasi
        akhir dan responsi.

        Kehadiran praktikum juga menjadi salah satu komponen yang mempengaruhi nilai, jadi pastikan
        untuk selalu hadir pada setiap pertemuan praktikum.
    """,

    # ================= NILAI =================

    "nilai_sistem": """
        Sistem penilaian praktikum di Informatika UAD umumnya menggunakan beberapa komponen penilaian
        untuk mengukur pemahaman dan kemampuan mahasiswa selama praktikum berlangsung.

        Komponen penilaian biasanya meliputi:
        - Pre-test → untuk mengukur pemahaman awal sebelum praktikum dimulai
        - Post-test → untuk mengevaluasi pemahaman setelah praktikum selesai
        - Studi kasus atau proyek → pengerjaan tugas secara individu atau kelompok
        - Laporan praktikum → penilaian dari hasil dan dokumentasi praktikum
        - Keaktifan dan tugas → partisipasi mahasiswa selama kegiatan praktikum berlangsung

        Penilaian praktikum biasanya disesuaikan dengan ketentuan masing-masing mata kuliah dan
        laboratorium.
    """,

    "nilai_revisi": """
        Jika terjadi kesalahan penilaian,
        mahasiswa dapat menghubungi asisten praktikum
        untuk melakukan konfirmasi atau revisi nilai.
    """,

    "nilai_pindah": """
        Jika kamu mengganti atau pindah jadwal praktikum, biasanya data dan nilai praktikum juga akan 
        menyesuaikan dengan jadwal yang baru.

        Namun, sebelum melakukan perpindahan jadwal, sebaiknya konfirmasikan terlebih dahulu
        kepada asisten praktikum agar proses verifikasi data dan nilai dapat dilakukan dengan
        benar.
    """,

    "nilai_matkul": """
        Nilai praktikum biasanya memiliki pengaruh yang cukup besar terhadap nilai akhir mata kuliah.
        Pada beberapa mata kuliah, komponen praktikum dapat berkontribusi sekitar 20%-40% dari total 
        nilai akhir, tergantung ketentuan pada RPS masing-masing mata kuliah.

        Selain itu, praktikum juga sering menjadi salah satu syarat kelulusan mata kuliah tertentu.
        Karena itu, pastikan kamu mengikuti praktikum dengan baik dan menjaga nilai tetap aman.
    """,
    
    "nilai_responsi": """
        Nilai praktikum dan nilai responsi merupakan komponen penilaian yang berbeda.

        Nilai praktikum tidak secara langsung mempengaruhi nilai responsi, namun keduanya biasanya
        akan digabung untuk menjadi nilai akhir praktikum atau mata kuliah terkait.
    """,

    "nilai_default": """
        Penilaian praktikum biasanya terdiri dari:
        - Kehadiran
        - Tugas praktikum
        - Responsi
        - Praktik langsung
    """,

    # ================= PERALATAN =================

    "peralatan_laptop": """
        Beberapa praktikum memperbolehkan mahasiswa menggunakan laptop pribadi sesuai ketentuan
        yang berlaku di laboratorium.

        Namun, penggunaan laptop pribadi tetap harus mengikuti arahan dari asisten praktikum atau
        laboran pada mata kuliah tersebut.
    """,

    "peralatan_modul": """
        Mahasiswa biasanya tidak diwajibkan membawa modul atau catatan praktikum ke laboratorium.

        Hal ini karena modul praktikum umumnya sudah tersedia pada komputer laboratorium atau
        dibagikan secara digital oleh asisten praktikum.
    """,

    "peralatan_default": """
        Perlengkapan yang dibutuhkan saat praktikum
        biasanya akan diinformasikan oleh asisten praktikum
        sebelum praktikum dimulai.
    """,

    # ================= ONLINE =================

    "online_ai": """
        Penggunaan AI seperti ChatGPT biasanya tidak diperbolehkan saat praktikum atau
        post-test berlangsung.

        Namun, penggunaan browser untuk kebutuhan praktikum, seperti membuka dokumentasi atau
        localhost, umumnya masih diperbolehkan sesuai ketentuan laboratorium.

        Karena itu, pastikan kamu bertanya terlebih dahulu kepada asisten laboratorium sebelum
        menggunakan tools tertentu agar tidak dianggap melakukan kecurangan saat praktikum
        berlangsung.
    """,

    "online_aturan":"""
        Aturan praktikum online yang umum diterapkan antara lain:
        1. Hadir tepat waktu sesuai jadwal praktikum.
        2. Menggunakan nama asli dan NIM pada akun meeting.
        3. Menyiapkan perangkat, internet, dan software yang dibutuhkan sebelum praktikum dimulai.
        4. Mengikuti instruksi dosen atau asisten laboratorium selama praktikum berlangsung.
        5. Menjaga etika dan ketertiban saat sesi online.
        6. Mengumpulkan tugas atau laporan sesuai format dan batas waktu.
        7. Tidak melakukan kecurangan, termasuk menyalin pekerjaan teman atau menggunakan AI seperti
           ChatGPT tanpa izin jika tidak diperbolehkan.
        8. Tetap aktif dan tidak meninggalkan sesi tanpa izin.

    """,

    "online_masalah": """
        Jika mengalami kendala internet saat praktikum online,
        segera informasikan kepada asisten praktikum.
    """,

    "online_default": """
        Beberapa praktikum dapat dilaksanakan secara online sesuai ketentuan mata kuliah atau
        laboratorium.

        Karena itu, mahasiswa disarankan memiliki atau menyiapkan laptop pribadi agar dapat
        mengikuti praktikum online dengan lancar.
    """,

    # ================= PENDAFTARAN =================

    "pendaftaran_mekanisme": """
        Pendaftaran praktikum biasanya dilakukan pada awal semester dan dilaksanakan secara online
        melalui sistem registrasi laboratorium.

        Berikut tahapan pendaftaran praktikum yang biasanya dilakukan:
        1. Melakukan registrasi akun pada sistem laboratorium
        2. Memilih mata praktikum sesuai mata kuliah yang sudah diambil di KRS
        3. Melakukan pembayaran biaya praktikum sesuai ketentuan laboratorium
        4. Mengunggah bukti pembayaran untuk proses aktivasi akun
        5. Setelah akun aktif, mahasiswa dapat memilih jadwal atau slot praktikum yang tersedia

        Jika terlambat mendaftar praktikum, mahasiswa dapat menghubungi asisten praktikum atau
        laboratorium untuk menanyakan kemungkinan pendaftaran susulan atau mendaftar secara manual
        dengan laboran.

        Pastikan data yang dimasukkan sudah benar dan selalu pantau informasi terbaru dari
        laboratorium agar tidak melewatkan jadwal pendaftaran.

    """,

    "pendaftaran_telat": """
        Jika terlambat mendaftar praktikum,
        mahasiswa dapat menghubungi asisten praktikum
        atau laboratorium untuk menanyakan kemungkinan pendaftaran susulan.
    """,

    "pendaftaran_jadwal": """
        Jadwal pendaftaran praktikum biasanya diumumkan sebelum awal semester atau sebelum kegiatan
        praktikum dimulai.

        Umumnya, pendaftaran praktikum berlangsung selama 1-2 minggu setelah perkuliahan dimulai.
        Untuk semester gasal, pendaftaran biasanya ditutup pada minggu kedua atau ketiga bulan
        September, sedangkan semester genap umumnya ditutup pada minggu kedua atau ketiga bulan
        Maret.

        Pastikan kamu selalu memantau informasi terbaru dari laboratorium agar tidak melewatkan
        jadwal pendaftaran.
    """,

    "pendaftaran_syarat": """
        Beberapa syarat mengikuti praktikum biasanya meliputi:
        - Terdaftar pada mata kuliah praktikum
        - Melakukan pendaftaran praktikum
        - Sudah melakukan aktivasi pembayaran praktikum
    """,

    "pendaftaran_slot": """
        Kuota praktikum biasanya terbatas sesuai kapasitas laboratorium dan jumlah asisten
        praktikum.

        Jika slot praktikum sudah penuh, mahasiswa dapat menghubungi pihak laboratorium atau
        menunggu informasi mengenai pembukaan slot tambahan.
    """,

    "pendaftaran_bayar": """
        Biaya praktikum biasanya digunakan untuk mendukung kebutuhan operasional laboratorium dan
        pelaksanaan kegiatan praktikum.
    """,

    "pendaftaran_link": """
        Informasi dan link pendaftaran praktikum
        biasanya dibagikan melalui laboratorium,
        grup praktikum, atau sistem informasi akademik.
    """,

    "pendaftaran_default": """
        Pendaftaran praktikum biasanya dilakukan
        melalui sistem atau informasi yang diberikan laboratorium.

        Pastikan mahasiswa mengikuti prosedur
        dan jadwal pendaftaran yang telah ditentukan.
    """,

    # ================= LAB =================

    "lab_peminjaman": """
        Peminjaman alat di Laboratorium Teknik Informatika UAD biasanya dilakukan melalui pengajuan
        formulir dan persetujuan dari laboran atau pihak laboratorium.

        Berikut prosedur umum peminjaman alat:
        - Mengambil atau mengunduh formulir peminjaman alat laboratorium
        - Mengisi data peminjaman dengan lengkap dan benar
        - Meminta persetujuan atau tanda tangan dari pihak laboratorium
        - Menyerahkan formulir kepada laboran untuk proses verifikasi
        - Setelah selesai digunakan, alat wajib dikembalikan dan dicek kondisinya oleh laboran

        Mahasiswa juga bertanggung jawab menjaga alat yang dipinjam selama masa penggunaan.
        Sebelum mengajukan peminjaman, pastikan terlebih dahulu ketersediaan alat di laboratorium.
    """,

    "lab_rusak": """
        Jika alat laboratorium rusak karena kelalaian praktikan, maka praktikan tersebut biasanya
        bertanggung jawab untuk mengganti atau memperbaiki alat yang rusak.

        Namun, jika kerusakan bukan disebabkan oleh kelalaian praktikan, sebaiknya segera jelaskan
        kronologi kejadian kepada asisten laboratorium agar dapat dilakukan pengecekan lebih lanjut
        terkait penyebab kerusakan alat tersebut.
    """,

    "lab_default": """
        Peminjaman alat laboratorium harus mengikuti
        prosedur dan ketentuan yang berlaku.
    """,

    # ================= KELULUSAN =================

    "kelulusan_matkul": """
        Praktikum dan mata kuliah teori di Informatika UAD saling berkaitan.

        Praktikum dibuat untuk membantu mahasiswa memahami dan menerapkan materi yang sudah
        dipelajari saat perkuliahan teori.

        Karena itu, beberapa praktikum biasanya memiliki mata kuliah prasyarat yang harus sudah
        lulus terlebih dahulu sebelum mahasiswa dapat mengikuti atau lulus praktikum tersebut.

        Umumnya, mahasiswa diwajibkan memperoleh nilai minimal tertentu pada mata kuliah terkait
        agar dapat mengambil praktikum lanjutan.

        Jadi, pastikan kamu memahami materi teori dengan baik karena hal tersebut juga akan
        membantu proses praktikum berjalan lebih lancar.
    """,

    "kelulusan_syarat": """
        Untuk lulus praktikum, mahasiswa biasanya harus memenuhi beberapa ketentuan yang telah
        ditetapkan oleh laboratorium atau mata kuliah terkait.

        Beberapa syarat umum kelulusan praktikum meliputi:
        - Mengikuti praktikum sesuai jadwal dan memenuhi minimal kehadiran
        - Mengumpulkan laporan praktikum tepat waktu
        - Mengikuti serta menyelesaikan ujian atau responsi praktikum
        - Memenuhi standar nilai yang telah ditentukan laboratorium

        Jika belum lulus praktikum, mahasiswa biasanya dapat mendaftar ulang pada semester
        berikutnya sesuai ketentuan yang berlaku.

        Pada beberapa praktikum tertentu, mahasiswa juga diwajibkan lulus mata kuliah terkait
        terlebih dahulu sebelum dapat mengikuti atau menyelesaikan praktikum lanjutan.
    """,

    "kelulusan_default": """
        Kelulusan praktikum ditentukan berdasarkan
        ketentuan nilai dan kehadiran praktikum.
    """,

    # ================= DEFAULT =================

    "default": """
        Maaf, saya belum memahami pertanyaan Anda.
        Silakan gunakan pertanyaan yang lebih spesifik.
    """
}


# =========================================================
# ================= ACTION CLASS ==========================
# =========================================================

class ActionHandlePraktikum(Action):

    def name(self) -> Text:
        return "action_handle_praktikum"

    # ================= INHAL =================

    def handle_inhal(self, dispatcher, text):

        if has_keyword(text, ["bayar", "membayar", "cara", "mengikuti",
                              "izin", "sakit", "tidak hadir", "musibah",
                              "diperbaiki", "alfa", "inhal", "susulan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["inhal_cara"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["inhal_default"])
            )

    # ================= JADWAL =================

    def handle_jadwal(self, dispatcher, text):

        if has_keyword(text, ["pindah", "ganti jadwal", "bentrok", "mengganti",
                              "diubah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["jadwal_pindah"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["jadwal_default"])
            )
        
    # ================= ATURAN =================

    def handle_aturan(self, dispatcher, text):

        if has_keyword(text, ["hp", "handphone"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_hp"])
            )

        elif has_keyword(text, ["browser", "internet", "chatgpt", "google"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_browser"])
            )

        elif has_keyword(text, ["kerja sama", "teman", "kelompok", "sendiri"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_kerjasama"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_default"])
            )

    # ================= KEHADIRAN =================

    def handle_kehadiran(self, dispatcher, text):

        if has_keyword(text, ["telat", "terlambat", "alfa", "tidak hadir"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_rules"])
            )
            
        elif has_keyword(text, ["minimal", "minimum"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_minimal"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_default"])
            )

    # ================= NILAI =================

    def handle_nilai(self, dispatcher, text):

        if has_keyword(text, ["dirubah", "diubah", "revisi", "salah nilai", "salah", "diperbaiki"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_revisi"])
            )

        elif has_keyword(text, ["sistem"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_sistem"])
            )
            
        elif has_keyword(text, ["pindah", "mengganti"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_pindah"])
            )

        elif has_keyword(text, ["matkul", "mata kuliah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_matkul"])
            )

        elif has_keyword(text, ["responsi"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_responsi"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_default"])
            )

    # ================= PERALATAN =================

    def handle_peralatan(self, dispatcher, text):

        if has_keyword(text, ["laptop"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["peralatan_laptop"])
            )

        elif has_keyword(text, ["modul", "catatan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["peralatan_modul"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["peralatan_default"])
            )

    # ================= ONLINE =================

    def handle_online(self, dispatcher, text):

        if has_keyword(text, ["ai", "chatgpt", "internet", "browser", "google"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["online_ai"])
            )

        elif has_keyword(text, ["masalah", "bermasalah", "koneksi", "wifi"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["online_masalah"])
            )

        elif has_keyword(text, ["aturan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["online_aturan"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["online_default"])
            )

    # ================= PENDAFTARAN =================

    def handle_pendaftaran(self, dispatcher, text):

        if has_keyword(text, ["tahapan", "cara", "prosedur", "telat", "terlambat"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_mekanisme"])
            )

        elif has_keyword(text, ["kapan", "buka", "ditutup", "dibuka" ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_jadwal"])
            )

        elif has_keyword(text, ["syarat", "administrasi", "dipersiapkan" ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_syarat"])
            )

        elif has_keyword(text, ["pilih ulang", "slot habis", "kuota", "slot"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_slot"])
            )

        elif has_keyword(text, ["bayar", "biaya"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_bayar"])
            )

        elif has_keyword(text, ["link", "tempat"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_link"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["pendaftaran_default"])
            )

    # ================= LAB =================

    def handle_lab(self, dispatcher, text):

        if has_keyword(text, ["prosedur", "cara", "meminjam", "aturan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["lab_peminjaman"])
            )
        elif has_keyword(text, ["rusak", "kelalaian" ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["lab_rusak"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["lab_default"])
            )

    # ================= KELULUSAN =================

    def handle_kelulusan(self, dispatcher, text):

        if has_keyword(text, ["matkul", "mata kuliah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kelulusan_matkul"])
            )

        elif has_keyword(text, ["syarat", "mengulang", "ulang" ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kelulusan_syarat"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kelulusan_default"])
            )

    # ================= RUN =================

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        try:

            intent = tracker.latest_message.get(
                "intent", {}
            ).get("name")

            text = tracker.latest_message.get(
                "text", ""
            ).strip().lower()

            # Jangan proses jika kosong
            if not text:
                return []

            if intent == "tanya_inhal_praktikum":
                self.handle_inhal(dispatcher, text)
            
            elif intent == "tanya_jadwal_praktikum":
                self.handle_jadwal(dispatcher, text)
            
            elif intent == "tanya_aturan_praktikum":
                self.handle_aturan(dispatcher, text)

            elif intent == "tanya_kehadiran_praktikum":
                self.handle_kehadiran(dispatcher, text)

            elif intent == "tanya_nilai_praktikum":
                self.handle_nilai(dispatcher, text)

            elif intent == "tanya_peralatan_praktikum":
                self.handle_peralatan(dispatcher, text)

            elif intent == "tanya_online_praktikum":
                self.handle_online(dispatcher, text)

            elif intent == "tanya_pendaftaran_praktikum":
                self.handle_pendaftaran(dispatcher, text)

            elif intent == "tanya_peminjaman_lab":
                self.handle_lab(dispatcher, text)

            elif intent == "tanya_kelulusan_praktikum":
                self.handle_kelulusan(dispatcher, text)

            else:
                dispatcher.utter_message(
                    text=clean_response(RESPONSES["default"])
                )

        except Exception as e:

            dispatcher.utter_message(
                text=f"Error praktikum: {str(e)}"
            )

            print(f"ERROR ACTION PRAKTIKUM: {e}")

        return []
