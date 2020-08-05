import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import QRCode from "qrcode.react";

import Logo from "../../components/logo/logo";

const Invoice: React.FC = () => {
  const router = useRouter();
  const { invoiceID } = router.query;
  return (
    <motion.main className="page">
      <div className="d-flex flex-center">
        <Logo />
      </div>

      {invoiceID}
      <div className="d-flex flex-center w-100">
        <div className="invoice">
          Scan the QR
          <span className="caption">
            Scan the QR code with your wallet or copy the address to pay.
          </span>
          <div className="qr-code">
            <QRCode
              value="bitcoincash:qp4m6jn77h4jyf5rz8kflx2p55xtcthrpyau7x02ej"
              size={364 - 160}
              bgColor="#121c23"
              fgColor="#50e3c2"
            />
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Invoice;
