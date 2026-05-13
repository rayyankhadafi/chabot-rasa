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

    # ================= NILAI =================

    "nilai_tidak_sesuai": """
        Jika nilai responsi tidak sesuai, silakan hubungi asisten praktikum terkait.
        Nantinya akan dilakukan pengecekan ulang, dan jika terjadi kesalahan input maka nilai dapat diperbaiki.
    """,

    "nilai_perbaikan": """
        Nilai responsi biasanya masih dapat diperbaiki melalui praktikum ulang atau remedial
        sesuai kebijakan laboratorium.
    """,

    "nilai_minimal": """
        Nilai minimal kelulusan praktikum umumnya adalah C.
        Namun ketentuan dapat berbeda tergantung kebijakan mata kuliah.
    """,

    "nilai_perbandingan": """
        Nilai responsi berbeda dengan nilai mata kuliah teori.
        Nilai responsi merupakan bagian dari penilaian praktikum.
        
        Nantinya, nilai praktikum dan responsi akan digabung sebagai salah satu
        komponen penilaian mata kuliah.
        Karena itu, jika nilai praktikum atau responsi kurang baik, hal tersebut 
        dapat mempengaruhi nilai akhir mata kuliah.
    """,

    "nilai_komputer": """
        Jika terjadi kendala komputer saat responsi, segera laporkan kepada asisten praktikum.
        Biasanya akan diberikan solusi seperti pergantian perangkat atau tambahan waktu.
    """,

    "nilai_tidak_masuk": """
        Jika nilai responsi kamu belum muncul pada hasil penilaian, silakan hubungi asisten praktikum untuk
        dilakukan pengecekan lebih lanjut. 
        Setelah proses pengecekan selesai, nilai akan diperbarui atau ditampilkan sesuai data yang telah diverifikasi.
    """,

    "nilai_penting": """
        Nilai responsi merupakan salah satu komponen penting dalam penilaian mata kuliah praktikum.
        Jika nilai responsi kosong atau bernilai 0, hal tersebut dapat mempengaruhi nilai akhir mata kuliah dan 
        membuat hasil akhir menjadi lebih rendah.
        Karena itu, pastikan kamu mengikuti responsi dan menyelesaikannya dengan baik.
    """,

    "nilai_default": """
        Nilai responsi merupakan hasil evaluasi kegiatan praktikum mahasiswa.
    """,

    # ================= JADWAL =================

    "jadwal_kapan": """
        Jadwal responsi biasanya diumumkan oleh asisten praktikum menjelang akhir semester.
        Pastikan tetap memantau informasi dari asisten atau koordinator praktikum.
    """,

    "jadwal_berubah": """
        Jadwal responsi dapat berubah sewaktu-waktu sesuai ketentuan laboratorium.

        Oleh karena itu, pastikan kamu selalu memantau:
        -Grup WhatsApp praktikum
        -Informasi dari asisten praktikum
        -Website TIF UAD

        agar tidak ketinggalan informasi terbaru terkait perubahan jadwal responsi.
    """,

    "jadwal_default": """
        Informasi mengenai jadwal responsi dapat ditanyakan langsung kepada asisten praktikum.
        Selain itu, kamu juga dapat memantau grup praktikum atau informasi resmi dari web tif laboratorium untuk
        mendapatkan update terbaru.
    """,

    # ================= MEKANISME =================

    "mekanisme_umum": """
        Responsi praktikum biasanya dilaksanakan di akhir semester sebagai bagian dari evaluasi akhir praktikum.
        Responsi dapat dilaksanakan secara offline menggunakan komputer di laboratorium maupun online dengan
        laptop pribadi untuk beberapa mata kuliah tertentu.
        
        Pelaksanaannya umumnya meliputi:
        - Ujian tertulis sekitar 15 menit
        - Praktik langsung di laboratorium sekitar 60 menit
        - Pengawasan oleh asisten praktikum selama responsi berlangsung
        - Toleransi keterlambatan maksimal 15 menit

        Selama responsi berlangsung, mahasiswa wajib mematuhi tata tertib laboratorium dan mengerjakan soal secara mandiri.
    """,

    "mekanisme_kertas": """
        Responsi biasanya terdiri dari teori dan praktik.
        - Praktik menggunakan komputer laboratorium
        - Teori menggunakan kertas tulis
    """,

    "mekanisme_kelompok": """
        Responsi umumnya dilaksanakan secara individu.
        Namun, pada kondisi atau mata kuliah tertentu, responsi dapat dilakukan secara kelompok
        sesuai ketentuan dari asisten atau koordinator praktikum.
    """,

    "mekanisme_soal": """
        Format soal responsi dapat berupa teori,
        praktik coding, analisis program, maupun studi kasus.
    """,

    "mekanisme_inhal": """
        Responsi susulan (inhal) biasanya diperbolehkan
        jika memiliki alasan yang sah seperti sakit atau musibah.
    """,

    "mekanisme_online": """
        Beberapa praktikum dapat melaksanakan responsi secara online
        menggunakan platform seperti Google Meet atau Google Classroom.
    """,

    "mekanisme_browser": """
        Penggunaan browser tergantung kebijakan praktikum.
        Akses di luar kebutuhan praktikum biasanya tidak diperbolehkan.
    """,

    "mekanisme_alat": """
        Jika mengalami kendala alat atau komputer,
        segera laporkan kepada asisten praktikum.
    """,

    "mekanisme_default": """
        Responsi dilaksanakan sebagai evaluasi akhir praktikum
        dalam bentuk teori maupun praktik.
    """,

    # ================= KEHADIRAN =================

    "kehadiran_tidak_hadir": """
        Jika kamu tidak dapat hadir responsi karena alasan yang valid,
        seperti sakit, musibah, atau keperluan mendesak lainnya,
        biasanya kamu dapat mengajukan responsi susulan setelah mendapat
        persetujuan dari asisten praktikum.

        Namun, jika tidak hadir tanpa alasan yang sah,
        nilai responsi dapat menjadi 0.
    """,

    "kehadiran_minimal": """
        Mahasiswa harus memenuhi minimal 11 praktikum (80%) atau batas tidak hadir
        (inhal) 3 kali kehadiran praktikum agar dapat mengikuti responsi.
    """,

    "kehadiran_wajib": """
        Ya, responsi praktikum umumnya bersifat wajib karena akan mempengaruhi nilai akhir
        bagi mahasiswa yang mengambil praktikum tersebut.
    """,

    "kehadiran_default": """
        Kehadiran praktikum menjadi salah satu syarat mengikuti responsi.
    """,

    # ================= SANKSI =================

    "sanksi_mencontek": """
        Mahasiswa yang terbukti mencontek saat responsi
        dapat dikenakan nilai 0 atau dinyatakan tidak lulus praktikum.
    """,

    "sanksi_lapor": """
        Jika menemukan tindakan mencontek,
        kamu dapat melaporkannya kepada asisten praktikum.
    """,

    "sanksi_tanya_teman": """
        Peserta diharapkan mengerjakan responsi secara mandiri
        dan tidak bertanya kepada teman.
    """,

    "sanksi_ulang": """
        Responsi ulang dapat diajukan
        jika memiliki alasan dan bukti yang valid.
    """,

    "sanksi_telat": """
        Mahasiswa biasanya tidak dikenakan denda,
        namun tetap harus mengikuti aturan laboratorium.
    """,

    "sanksi_default": """
        Pelanggaran aturan responsi dapat dikenakan sanksi
        sesuai ketentuan laboratorium.
    """,

    # ================= SUSULAN =================

    "susulan": """
        Responsi susulan dapat diajukan
        jika memiliki alasan yang sah dan disetujui laboratorium.
    """,

    # ================= ATURAN =================

    "aturan_telat": """
        Mahasiswa yang terlambat biasanya masih diberikan toleransi,
        namun jika melewati batas maka dapat dianggap tidak hadir.
    """,

    "aturan_catatan": """
        Mahasiswa umumnya tidak diperbolehkan membawa catatan,
        kecuali diizinkan oleh asisten praktikum.
    """,

    "aturan_hp": """
        Penggunaan HP saat responsi umumnya tidak diperbolehkan,
        kecuali untuk keperluan tertentu yang telah diizinkan.
    """,

    "aturan_default": """
        Berikut beberapa aturan umum saat mengikuti responsi praktikum di Informatika UAD:

        -Hadir tepat waktu dengan toleransi keterlambatan maksimal 15 menit
        -Jika terlambat melebihi batas, mahasiswa biasanya tidak diperbolehkan mengikuti responsi dan nilai dapat menjadi 0
        -Responsi umumnya dilaksanakan secara offline di laboratorium pada akhir periode praktikum
        -Waktu responsi biasanya terdiri dari sesi persiapan, pengerjaan soal, dan penutupan
        -Mahasiswa wajib berpakaian rapi dan menjaga ketertiban selama di laboratorium
        -Tidak diperbolehkan membawa makanan atau minuman ke dalam ruang laboratorium
        -Dilarang mengubah pengaturan komputer atau melepas perangkat laboratorium tanpa izin asisten

        Pastikan kamu selalu mengikuti arahan dari asisten praktikum agar responsi berjalan dengan lancar.
    """,

    # ================= PENGERTIAN =================

    "pengertian": """
        Responsi adalah ujian evaluasi akhir praktikum
        untuk mengukur pemahaman mahasiswa terhadap materi praktikum.
    """,

    # ================= BIAYA =================

    "biaya": """
        Mahasiswa umumnya tidak dikenakan biaya tambahan
        untuk mengikuti responsi praktikum.
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

class ActionHandleResponsi(Action):

    def name(self) -> Text:
        return "action_handle_responsi"

    # ================= NILAI =================

    def handle_nilai(self, dispatcher, text):

        if has_keyword(text, ["tidak sesuai", "salah", "direvisi", "komplain", "dikomplain", "revisi", "berubah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_tidak_sesuai"])
            )

        elif has_keyword(text, ["diperbaiki", "remedial", "ulang"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_perbaikan"])
            )

        elif has_keyword(text, ["minimal", "lulus", "minimum"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_minimal"])
            )

        elif has_keyword(text, ["matkul", "teori", "mata kuliah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_perbandingan"])
            )

        elif has_keyword(text, ["komputer", "error", "rusak"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_komputer"])
            )

        elif has_keyword(text, ["belum masuk", "tidak masuk", "ngak masuk", "tidak keluar"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_tidak_masuk"])
            )

        elif has_keyword(text, ["penting", "mempengaruhi matkul", "mempengaruhi nilai", "mempengaruhi mata kuliah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_penting"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["nilai_default"])
            )

    # ================= JADWAL =================

    def handle_jadwal(self, dispatcher, text):

        if has_keyword(text, [
            "kapan", "tanggal",
            "hari", "dilaksanakan"
        ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["jadwal_kapan"])
            )
        
        elif has_keyword(text, ["berubah", "perubahan", "diubah"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["jadwal_berubah"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["jadwal_default"])
            )

    # ================= MEKANISME =================

    def handle_mekanisme(self, dispatcher, text):

        if has_keyword(text, ["panduan", "pelaksanaan", "mekanisme", "alur", "mempraktikan", "offline", 
                              "laptop pribadi", "komputer lab", "pengawas", "proses", "cara mengikuti responsi"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_umum"])
            )

        elif has_keyword(text, ["kertas", "komputer"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_kertas"])
            )

        elif has_keyword(text, ["kelompok", "individu", "sendiri"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_kelompok"])
            )

        elif has_keyword(text, ["format soal", "bentuk soal", "teori", "praktik"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_soal"])
            )

        elif has_keyword(text, ["inhal", "susulan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_inhal"])
            )

        elif has_keyword(text, ["online"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_online"])
            )

        elif has_keyword(text, [
            "browser",
            "internet",
            "chatgpt",
        ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_browser"])
            )

        elif has_keyword(text, [
            "alat",
            "masalah",
            "kendala",
            "alat labor"
        ]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_alat"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["mekanisme_default"])
            )

    # ================= KEHADIRAN =================

    def handle_kehadiran(self, dispatcher, text):

        if has_keyword(text, ["tidak hadir", "absen", "sakit", "musibah", "hal mendesak",
                              "izin", "tidak masuk"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_tidak_hadir"])
            )

        elif has_keyword(text, ["minimal", "kehadiran", "persen"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_minimal"])
            )

        elif has_keyword(text, ["wajib"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_wajib"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["kehadiran_default"])
            )

    # ================= SANKSI =================

    def handle_sanksi(self, dispatcher, text):

        if has_keyword(text, ["mencontek", "curang"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_mencontek"])
            )

        elif has_keyword(text, ["lapor", "dilaporkan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_lapor"])
            )

        elif has_keyword(text, ["bertanya ke teman"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_tanya_teman"])
            )

        elif has_keyword(text, ["ulang", "susulan"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_ulang"])
            )

        elif has_keyword(text, ["denda", "telat"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_telat"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["sanksi_default"])
            )

    # ================= SUSULAN =================

    def handle_susulan(self, dispatcher, text):

        dispatcher.utter_message(
            text=clean_response(RESPONSES["susulan"])
        )

    # ================= ATURAN =================

    def handle_aturan(self, dispatcher, text):

        if has_keyword(text, ["telat", "terlambat"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_telat"])
            )

        elif has_keyword(text, ["catatan", "buku"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_catatan"])
            )

        elif has_keyword(text, ["hp", "handphone"]):
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_hp"])
            )

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["aturan_default"])
            )

    # ================= PENGERTIAN =================

    def handle_pengertian(self, dispatcher, text):

        dispatcher.utter_message(
            text=clean_response(RESPONSES["pengertian"])
        )

    # ================= BIAYA =================

    def handle_biaya(self, dispatcher, text):

        dispatcher.utter_message(
            text=clean_response(RESPONSES["biaya"])
        )

    # ================= RUN =================

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message.get(
            "intent", {}
        ).get("name")

        text = tracker.latest_message.get(
            "text", ""
        ).strip().lower()

        # Jangan proses jika kosong
        if not text:
            return []

        if intent == "tanya_nilai_responsi":
            self.handle_nilai(dispatcher, text)

        elif intent == "tanya_jadwal_responsi":
            self.handle_jadwal(dispatcher, text)

        elif intent == "tanya_mekanisme_responsi":
            self.handle_mekanisme(dispatcher, text)

        elif intent == "tanya_kehadiran_responsi":
            self.handle_kehadiran(dispatcher, text)

        elif intent == "tanya_sanksi_responsi":
            self.handle_sanksi(dispatcher, text)

        elif intent == "tanya_susulan_responsi":
            self.handle_susulan(dispatcher, text)

        elif intent == "tanya_aturan_responsi":
            self.handle_aturan(dispatcher, text)

        elif intent == "tanya_pengertian_responsi":
            self.handle_pengertian(dispatcher, text)

        elif intent == "tanya_biaya_responsi":
            self.handle_biaya(dispatcher, text)

        else:
            dispatcher.utter_message(
                text=clean_response(RESPONSES["default"])
            )

        return []
