import React, { useState } from "react";

const Plans: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<"month" | "day">("month");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Our Suitable Packages
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan to boost your taxi business visibility and
          reach more customers
        </p>
      </div>

      {/* Period Toggle */}
      <div className="flex justify-center space-x-2 mb-8">
        <button
          onClick={() => setBillingPeriod("month")}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
            billingPeriod === "month"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          1 Month
        </button>
        <button
          onClick={() => setBillingPeriod("day")}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
            billingPeriod === "day"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          1 Day (24 hours)
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* VIP Plan */}
        <div className="border border-blue-200 rounded-2xl p-8 bg-blue-50 hover:shadow-lg transition-shadow">
          <div className="text-center mb-6">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block mb-4">
              VIP
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ${billingPeriod === "month" ? "40" : "3"}
            </div>
            <div className="text-gray-600">
              / {billingPeriod === "month" ? "Month" : "Day"}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Placement:</span>
                <p className="text-gray-700">Appears In Top Listings</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Highlight:</span>
                <p className="text-gray-700">
                  Driver Ad Card Is Marked With A VIP Tag/Badge
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Exposure:</span>
                <p className="text-gray-700">
                  3X More Visibility Than Free/Normal Ads
                </p>
              </div>
            </div>
            {billingPeriod === "day" && (
              <div className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">Duration:</span>
                  <p className="text-gray-700">24-hour premium exposure</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* VIP Prime Plan */}
        <div className="border border-orange-200 rounded-2xl p-8 bg-orange-50 hover:shadow-lg transition-shadow relative">
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>

          <div className="text-center mb-6 mt-4">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block mb-4">
              VIP Prime
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              ${billingPeriod === "month" ? "80" : "6"}
            </div>
            <div className="text-gray-600">
              / {billingPeriod === "month" ? "Month" : "Day"}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Placement:</span>
                <p className="text-gray-700">"VIP PRIME" Section</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Highlight:</span>
                <p className="text-gray-700">
                  Driver Ad Card Is Marked With A VIP PRIME Badge + Priority
                  Highlight
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Exposure:</span>
                <p className="text-gray-700">
                  5X More Visibility Than Normal Ads
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Rotation:</span>
                <p className="text-gray-700">
                  Auto Rotated Randomly If There Are Multiple VIP Prime Drivers
                </p>
              </div>
            </div>
            {billingPeriod === "day" && (
              <div className="flex items-start">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-gray-900">Duration:</span>
                  <p className="text-gray-700">
                    24-hour premium priority exposure
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Comparison */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Premium Plans?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Higher Visibility
            </h3>
            <p className="text-gray-600">
              Get 3-5x more views and customer inquiries with premium placement
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Trust Badge
            </h3>
            <p className="text-gray-600">
              Build customer confidence with verified VIP status badges
            </p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              More Bookings
            </h3>
            <p className="text-gray-600">
              Increase your earning potential with priority listing and better
              exposure
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How quickly will my ad become VIP after payment?
            </h3>
            <p className="text-gray-600">
              Your ad will be upgraded to VIP status within 2-4 hours after
              payment verification. You'll receive a confirmation email once
              activated.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I upgrade from VIP to VIP Prime anytime?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade to VIP Prime at any time. The system will
              adjust your billing and extend the benefits immediately.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What's the difference between 1 Day and 1 Month plans?
            </h3>
            <p className="text-gray-600">
              1 Day plans are perfect for special events or testing. 1 Month
              plans offer better value for regular business promotion and
              sustained visibility.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do VIP Prime ads really get 5X more visibility?
            </h3>
            <p className="text-gray-600">
              Yes! VIP Prime ads appear in the dedicated prime section at the
              top, get priority in search results, and are automatically rotated
              for maximum exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Need Help Choosing?
        </h3>
        <p className="text-gray-600 mb-6">
          Our team is here to help you select the best plan for your business
          needs
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://wa.me/12345678901"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            WhatsApp Support
          </a>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plans;
