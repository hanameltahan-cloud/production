import { useState, useCallback, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sparkles, Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";
import { IdeaContent } from "../components/IdeaContent";
import { useLanguage } from "../lib/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const CATEGORIES = [
  "AI Agents",
  "E-commerce",
  "Healthcare",
  "Education",
  "Finance",
  "Entertainment",
  "Productivity",
  "Social Media",
] as const;

export default function Home() {
  const { t, language, dir } = useLanguage();
  const [idea, setIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("AI Agents");
  const [copied, setCopied] = useState<boolean>(false);

  // Log language changes
  useEffect(() => {
    console.log("Current language:", language);
  }, [language]);

  const generateIdea = useCallback(async () => {
    setIdea("");
    setIsLoading(true);
    setCopied(false);

    try {
      // Call the API endpoint with streaming and language
      const apiUrl = `/api?category=${encodeURIComponent(
        category
      )}&lang=${language}`;
      console.log("Calling API with:", { category, language, url: apiUrl });

      const response = await fetch(apiUrl);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please sign in to generate business ideas");
          setIsLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setIdea((prev) => prev + parsed.content);
              }
            } catch {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(t.errors.generateFailed);
    } finally {
      setIsLoading(false);
    }
  }, [category, language, t.errors.generateFailed]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(idea);
      setCopied(true);
      toast.success(t.success.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.errors.copyFailed);
    }
  };

  // Auto-generate on first load
  useEffect(() => {
    generateIdea();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50"
      dir={dir}
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      {/* Language Switcher */}
      <LanguageSwitcher />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-violet-100 rounded-full mb-3 sm:mb-4">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600" />
            <span className="text-xs sm:text-sm text-violet-700">
              {t.header.poweredBy}
            </span>
          </div>
          <h1 className="mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent px-2">
            {t.header.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            {t.header.subtitle}
          </p>
        </header>

        {/* Category Selector */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-2">
            <label className="text-xs sm:text-sm text-gray-600">
              {t.categorySelector.label}
            </label>
            <Badge
              variant="secondary"
              className="bg-violet-100 text-violet-700 text-xs"
            >
              {CATEGORIES.length} {t.categorySelector.categoriesCount}
            </Badge>
          </div>

          <Tabs value={category} onValueChange={setCategory} className="w-full">
            <TabsList className="w-full h-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 bg-transparent p-0">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg border border-gray-200 bg-white hover:border-violet-300 transition-all"
                >
                  {t.categories[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center px-2">
          <Button
            onClick={generateIdea}
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                {t.buttons.generating}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t.buttons.generate}
              </>
            )}
          </Button>

          {idea && !isLoading && (
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  {t.buttons.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t.buttons.copy}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Content Card */}
        <div className="max-w-5xl mx-auto px-2">
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 min-h-[400px] sm:min-h-[500px]">
              {isLoading && !idea ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-violet-200 border-t-violet-600 rounded-full" />
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 text-center px-4">
                    {t.loading.generatingFor}{" "}
                    <span className="text-violet-600 font-medium">
                      {t.categories[category as keyof typeof t.categories]}
                    </span>
                    ...
                  </p>
                </div>
              ) : idea ? (
                <IdeaContent content={idea} isStreaming={isLoading} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-gray-400">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base text-center px-4">
                    {t.placeholder.clickToStart}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Footer */}
          {idea && !isLoading && (
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-500 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{t.stats.streaming}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {t.categories[category as keyof typeof t.categories]}
                </Badge>
              </div>
              <div>
                {idea.split(" ").length} {t.stats.words}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-500 px-4">
          <p>{t.footer.text}</p>
        </footer>
      </div>
    </div>
  );
}
