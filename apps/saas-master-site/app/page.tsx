import { Button } from '../../packages/shared/dist/ui/index.mjs'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">JobFlow</div>
          <div className="space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Streamline Your Job Management
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          JobFlow is a comprehensive SaaS platform for managing jobs, customers, and field operations.
          Multi-tenant, secure, and built for scale.
        </p>
        <div className="space-x-4">
          <Button size="lg" className="px-8 py-3">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose JobFlow?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Multi-Tenant SaaS</h3>
            <p className="text-gray-600">
              Secure, isolated tenant databases with automated provisioning and scaling.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Complete Job Workflow</h3>
            <p className="text-gray-600">
              From quotes to completion, manage every aspect of your jobs with ease.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Field & Office Integration</h3>
            <p className="text-gray-600">
              Seamless integration between office admin and field workers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of companies using JobFlow to streamline their operations.
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 JobFlow SaaS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}