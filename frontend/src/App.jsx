import { useState } from 'react';
import { urlService } from './services/api';
import { Clipboard, Link2, Search, Loader2, ArrowRight, Globe } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('shorten'); 
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [searchId, setSearchId] = useState('');
  
  // Result States
  const [result, setResult] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await urlService.shorten(longUrl, alias);
      setResult({ type: 'success', ...data });
      toast.success('URL Shortened successfully!');
      setLongUrl('');
      setAlias('');
    } catch (error) {
      console.error(error);
      toast.error('Alias might be taken.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await urlService.retrieve(searchId);
      setResult({ type: 'retrieve', ...data });
      toast.success('URL Found!');
    } catch (error) {
      console.error(error);
      toast.error('Short ID not found.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    // MAIN CONTAINER: Flex column on mobile, Flex ROW on laptop (md:flex-row)
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      <Toaster position="top-right" />
      
      {/* --- LEFT PANEL: CONTROL CENTER (Fixed width on laptop) --- */}
      <div className="w-full md:w-[450px] bg-white shadow-2xl z-10 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Link2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CloudShortener</h1>
          </div>
          <p className="text-gray-500 text-sm">Professional URL Management</p>
        </div>

        {/* Tabs */}
        <div className="flex p-2 mx-6 mt-6 bg-gray-100 rounded-xl">
          <button
            onClick={() => { setActiveTab('shorten'); setResult(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'shorten' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Shorten
          </button>
          <button
            onClick={() => { setActiveTab('retrieve'); setResult(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'retrieve' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Retrieve
          </button>
        </div>

        {/* Input Forms */}
        <div className="flex-1 p-8">
          {activeTab === 'shorten' ? (
            <form onSubmit={handleShorten} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://super-long-url.com/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Custom Alias <span className="text-gray-400 font-normal">(Optional)</span></label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden">
                  <span className="pl-4 pr-2 text-gray-400 text-sm">/</span>
                  <input
                    type="text"
                    placeholder="my-cool-link"
                    className="w-full px-2 py-3 bg-transparent outline-none text-gray-800"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Shorten URL <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRetrieve} className="space-y-6">
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Find Original Link</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter short ID (e.g. HojGDvPc)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Database'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2026 Cloud Computing Project</p>
        </div>
      </div>

      {/* --- RIGHT PANEL: RESULTS STAGE (Fills the rest of screen) --- */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 text-white">
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500 blur-3xl"></div>
            <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full max-w-2xl text-center">
          
          {!result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                <Globe className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Expand your reach,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">shorten your links.</span></h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Ready to deploy? Use the panel on the left to generate clean, trackable short links instantly via our Dockerized Python API.
              </p>
            </div>
          ) : (
            <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6">
                {result.type === 'success' ? <Link2 className="w-8 h-8" /> : <Search className="w-8 h-8" />}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {result.type === 'success' ? 'Link Ready to Share!' : 'Original Link Found'}
              </h3>
              
              {/* The Result Box */}
              <div className="mt-8 bg-slate-950/50 rounded-xl p-2 flex items-center border border-white/10">
                <div className="flex-1 px-4 py-3 text-left overflow-hidden">
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">
                    {result.type === 'success' ? 'Your Short Link' : 'Destination URL'}
                  </p>
                  <p className="text-lg md:text-xl font-mono text-indigo-300 truncate">
                    {result.type === 'success' 
                      ? `${import.meta.env.VITE_API_URL}/${result.short_id}` 
                      : result.long_url}
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(result.type === 'success' ? `${import.meta.env.VITE_API_URL}/${result.short_id}` : result.long_url)}
                  className="p-4 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <Clipboard className="w-6 h-6" />
                </button>
              </div>

              {result.type === 'success' && (
                <div className="mt-6 text-sm text-slate-400">
                  Redirects to: <span className="text-white underline decoration-indigo-500/50">{result.long_url}</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;