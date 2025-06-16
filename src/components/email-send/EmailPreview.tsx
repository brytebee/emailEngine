type Data = {
  firstName: string;
  subject: string;
  body: string;
  support: string;
};
interface EmailProp {
  logoUrl: string;
  formData: Data;
}
// Email Preview Component
const EmailPreview = ({ logoUrl, formData }: EmailProp) => (
  <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
    {/* Header with gradient background matching CustomEmail */}
    <div
      className="rounded-t-2xl p-8 text-center mb-4 relative"
      style={{
        background: "linear-gradient(135deg, #1e7c3e 0%, #166534 100%)",
      }}
    >
      {/* Logo container with enhanced styling */}
      <div className="mb-6 inline-block relative">
        {logoUrl && (
          <div
            className="inline-block relative"
            style={{
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
            }}
          >
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-20 h-20 mx-auto rounded-3xl object-cover"
              style={{
                border: "4px solid white",
                boxShadow: `
                0 16px 40px rgba(0, 0, 0, 0.2),
                0 8px 16px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              }}
            />
          </div>
        )}
      </div>

      {/* Brand name with enhanced typography */}
      <h2
        className="text-white font-bold uppercase tracking-widest text-base leading-tight"
        style={{
          textShadow: `
          0 2px 4px rgba(0, 0, 0, 0.3),
          0 4px 8px rgba(0, 0, 0, 0.2),
          0 8px 16px rgba(0, 0, 0, 0.1)
        `,
          WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.1)",
        }}
      >
        CORPORATE AFFAIRS COMMISSION
      </h2>
    </div>

    {/* Main content container with white background and shadow */}
    <div
      className="bg-white rounded-2xl relative z-10 p-6 space-y-6"
      style={{
        marginTop: "-20px",
        boxShadow: `
        0 20px 25px -5px rgba(0, 0, 0, 0.1), 
        0 10px 10px -5px rgba(0, 0, 0, 0.04)
      `,
      }}
    >
      {/* Greeting section */}
      <div className="text-center">
        <p className="text-gray-900 text-xl font-bold tracking-tight">
          Hello, {formData.firstName}! 👋
        </p>
      </div>

      {/* Subject section with badge */}
      {formData.subject && (
        <div className="text-center space-y-3">
          <div className="inline-block">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: "#dcfce7",
                color: "#1e7c3e",
                border: "1px solid #22c55e",
              }}
            >
              OFFICIAL COMMUNICATION
            </span>
          </div>
          <h3 className="text-gray-900 text-2xl font-extrabold tracking-tight leading-tight">
            {formData.subject}
          </h3>
        </div>
      )}

      {/* Content section with green accent */}
      <div
        className="rounded-xl p-6 relative"
        style={{
          backgroundColor: "#f0fdf4",
          borderLeft: "4px solid #1e7c3e",
        }}
      >
        <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
          {formData.body}
        </p>
      </div>

      {/* Support section if support email exists */}
      {formData.support && (
        <div
          className="rounded-xl p-6 text-center"
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
          }}
        >
          <p className="text-gray-900 text-base font-semibold mb-2">
            Need Help?
          </p>
          <p className="text-gray-600 text-sm">
            Our support team is here to assist you. Contact us at{" "}
            <span className="text-green-700 font-semibold">
              {formData.support}
            </span>
          </p>
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center pt-2">
        <div
          className="inline-block px-8 py-4 rounded-lg cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: "#1e7c3e",
            boxShadow: "0 4px 14px 0 rgba(30, 124, 62, 0.39)",
          }}
        >
          <span className="text-white text-base font-semibold">
            Access CAC Portal
          </span>
        </div>
      </div>
    </div>

    {/* Footer section */}
    <div
      className="rounded-b-2xl p-8 text-center mt-4"
      style={{ backgroundColor: "#1e7c3e" }}
    >
      <p className="text-white text-sm font-semibold uppercase tracking-wide mb-2">
        Securely powered by CORPORATE AFFAIRS COMMISSION
      </p>
      <p className="text-gray-200 text-xs">
        Federal Republic of Nigeria • Unity and Faith, Peace and Progress
      </p>
    </div>
  </div>
);

export default EmailPreview;
