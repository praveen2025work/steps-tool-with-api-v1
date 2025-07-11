import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, BarChart2, Brain, Table as TableIcon, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PivotTable from './PivotTable';
import FilterableDataGrid from './FilterableDataGrid';

interface FileData {
  id: string;
  name: string;
  sheets: {
    [key: string]: {
      headers: string[];
      rows: any[][];
    }
  };
}

interface AdvancedFilePreviewProps {
  fileId?: string;
  fileName?: string;
  onClose: () => void;
}

const AdvancedFilePreview: React.FC<AdvancedFilePreviewProps> = ({
  fileId = '',
  fileName = 'Unknown File',
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'data' | 'pivot' | 'ai'>('data');
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    // Don't fetch if fileId is empty
    if (!fileId) {
      setIsLoading(false);
      setFileData(null);
      setActiveSheet(null);
      return;
    }
    
    const fetchFileData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate a response with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create a default mock data structure that's guaranteed to be valid
        const defaultMockData: FileData = {
          id: fileId || 'unknown',
          name: fileName || 'Unknown File',
          sheets: {
            'Default': {
              headers: ['Column1', 'Column2'],
              rows: [['No data', 'available']]
            }
          }
        };
        
        // Try to create the real mock data, but fall back to default if anything fails
        let finalData: FileData;
        try {
          const mockData: FileData = {
            id: fileId,
            name: fileName || 'Unknown File',
            sheets: {
              'Sheet1': {
                headers: ['Date', 'Region', 'Product', 'Sales', 'Profit'],
                rows: [
                  ['2023-01-01', 'North', 'Widget A', 1200, 240],
                  ['2023-01-02', 'South', 'Widget B', 950, 190],
                  ['2023-01-03', 'East', 'Widget A', 1100, 220],
                  ['2023-01-04', 'West', 'Widget C', 1300, 260],
                  ['2023-01-05', 'North', 'Widget B', 1000, 200],
                ]
              },
              'Details': {
                headers: ['Property', 'Value', 'Description'],
                rows: [
                  ['File Type', 'Excel', 'Microsoft Excel Spreadsheet'],
                  ['Created Date', '2023-01-15', 'Date the file was created'],
                  ['Modified Date', '2023-05-10', 'Last modification date'],
                  ['Owner', 'John Smith', 'File owner'],
                  ['Size', '256 KB', 'File size in kilobytes'],
                ]
              },
              'Logs': {
                headers: ['Timestamp', 'User', 'Action', 'Details'],
                rows: [
                  ['2023-05-10 14:32:45', 'jsmith', 'EDIT', 'Updated sales figures'],
                  ['2023-05-09 11:15:22', 'agarcia', 'VIEW', 'Viewed file contents'],
                  ['2023-05-08 09:45:11', 'jsmith', 'EDIT', 'Added new product data'],
                  ['2023-05-07 16:20:33', 'bwilson', 'VIEW', 'Viewed file contents'],
                  ['2023-05-06 10:05:17', 'jsmith', 'CREATE', 'Created initial file'],
                ]
              }
            }
          };
          
          // Validate the mock data structure
          if (mockData && 
              typeof mockData === 'object' && 
              mockData.sheets && 
              typeof mockData.sheets === 'object' && 
              Object.keys(mockData.sheets).length > 0) {
            finalData = mockData;
          } else {
            finalData = defaultMockData;
          }
        } catch (innerError) {
          console.error('Error creating mock data:', innerError);
          finalData = defaultMockData;
        }
        
        // Set the file data
        setFileData(finalData);
        
        // Safely set active sheet only if sheets exist
        if (finalData && 
            finalData.sheets && 
            typeof finalData.sheets === 'object' && 
            Object.keys(finalData.sheets).length > 0) {
          setActiveSheet(Object.keys(finalData.sheets)[0]);
        } else {
          setActiveSheet('Default');
        }
      } catch (error) {
        console.error('Error fetching file data:', error);
        // Set to a minimal valid state instead of null
        setFileData({
          id: fileId || 'unknown',
          name: fileName || 'Unknown File',
          sheets: {
            'Error': {
              headers: ['Status'],
              rows: [['Failed to load data']]
            }
          }
        });
        setActiveSheet('Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileData();
  }, [fileId, fileName]);

  const handleRunAIAnalysis = async () => {
    if (!fileData || !fileId) {
      console.error('Cannot run AI analysis: No file data available');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store as a parsed object directly instead of a string
      setAiAnalysis({
        title: `File Analysis: ${fileName || 'Unknown File'}`,
        timestamp: new Date().toISOString(),
        sections: [
          {
            title: "Key Insights",
            type: "insights",
            items: [
              { text: "Sales are trending upward in the North and West regions", value: "+15%", sentiment: "positive" },
              { text: "Widget A is the top-performing product by volume", value: "42%", sentiment: "positive" },
              { text: "Profit margins are consistent across products", value: "~20%", sentiment: "neutral" }
            ]
          },
          {
            title: "Recommendations",
            type: "recommendations",
            items: [
              { text: "Increase marketing efforts in the South region to boost sales", priority: "high" },
              { text: "Consider expanding the Widget A product line given its popularity", priority: "medium" },
              { text: "Investigate opportunities to improve profit margins across all products", priority: "medium" }
            ]
          },
          {
            title: "Anomalies Detected",
            type: "anomalies",
            items: [
              { text: "No significant anomalies detected in the current dataset", severity: "none" }
            ]
          },
          {
            title: "Data Quality",
            type: "quality",
            score: 92,
            details: "High quality data with consistent formatting and no missing values"
          }
        ]
      });
    } catch (error) {
      console.error('Error running AI analysis:', error);
      setAiAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderDataSection = () => {
    if (!fileData) {
      return <div className="p-4 text-center text-muted-foreground">No file data available</div>;
    }
    
    if (!activeSheet) {
      return <div className="p-4 text-center text-muted-foreground">No active sheet selected</div>;
    }
    
    try {
      // Safely access sheet data with proper checks
      const sheets = fileData.sheets || {};
      const sheetData = sheets[activeSheet];
      
      if (!sheetData) {
        return <div className="p-4 text-center text-muted-foreground">Sheet data not found</div>;
      }
      
      if (!Array.isArray(sheetData.rows)) {
        return <div className="p-4 text-center text-muted-foreground">Invalid rows data format</div>;
      }
      
      if (!Array.isArray(sheetData.headers)) {
        return <div className="p-4 text-center text-muted-foreground">Invalid headers data format</div>;
      }
      
      // Convert sheet data to format expected by FilterableDataGrid
      const gridData = sheetData.rows.map((row, index) => {
        if (!row || !Array.isArray(row)) {
          return { id: index + 1 }; // Return minimal valid row if data is invalid
        }
        
        const rowData: Record<string, any> = { id: index + 1 };
        sheetData.headers.forEach((header, headerIndex) => {
          if (header && typeof header === 'string') {
            // Ensure we don't access out of bounds array elements
            rowData[header] = headerIndex < row.length ? row[headerIndex] : null;
          }
        });
        return rowData;
      });
      
      // Ensure we have valid data for the grid
      const safeGridData = Array.isArray(gridData) && gridData.length > 0 ? gridData : [{ id: 1 }];
      
      // Safely get sheet names
      const sheetNames = Object.keys(sheets || {});
      
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {sheetNames.map(sheetName => (
              <Button
                key={sheetName}
                variant={activeSheet === sheetName ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  try {
                    setActiveSheet(sheetName);
                  } catch (error) {
                    console.error("Error setting active sheet:", error);
                  }
                }}
              >
                {sheetName}
              </Button>
            ))}
          </div>
          
          <div className="data-grid-wrapper">
            {/* Wrap in error boundary div for safer rendering */}
            <div className="safe-render-container">
              {(() => {
                try {
                  return (
                    <FilterableDataGrid 
                      data={safeGridData} 
                      title={`${fileName || 'Unknown File'} - ${activeSheet || 'Sheet'}`} 
                    />
                  );
                } catch (error) {
                  console.error("Error rendering FilterableDataGrid:", error);
                  return (
                    <div className="p-4 text-center border border-red-200 bg-red-50 text-red-800 rounded-md">
                      Error displaying data grid. Please try again.
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering data section:", error);
      return (
        <div className="p-4 text-center border border-red-200 bg-red-50 text-red-800 rounded-md">
          Error displaying data. Please try again or select a different file.
        </div>
      );
    }
  };

  const renderPivotSection = () => {
    if (!fileData) {
      return <div className="p-4 text-center text-muted-foreground">No file data available</div>;
    }
    
    if (!activeSheet) {
      return <div className="p-4 text-center text-muted-foreground">No active sheet selected</div>;
    }
    
    try {
      // Safely access sheet data with proper checks
      const sheets = fileData.sheets || {};
      const sheetData = sheets[activeSheet];
      
      if (!sheetData) {
        return <div className="p-4 text-center text-muted-foreground">Sheet data not found</div>;
      }
      
      if (!Array.isArray(sheetData.rows)) {
        return <div className="p-4 text-center text-muted-foreground">Invalid rows data format</div>;
      }
      
      if (!Array.isArray(sheetData.headers)) {
        return <div className="p-4 text-center text-muted-foreground">Invalid headers data format</div>;
      }
      
      // Convert sheet data to format expected by PivotTable
      const pivotData = sheetData.rows.map((row, index) => {
        if (!row || !Array.isArray(row)) {
          return { id: index + 1 }; // Return minimal valid row if data is invalid
        }
        
        const rowData: Record<string, any> = { id: index + 1 };
        sheetData.headers.forEach((header, headerIndex) => {
          if (header && typeof header === 'string') {
            // Ensure we don't access out of bounds array elements
            rowData[header] = headerIndex < row.length ? row[headerIndex] : null;
          }
        });
        return rowData;
      });
      
      // Ensure we have valid data for the pivot table
      const safePivotData = Array.isArray(pivotData) && pivotData.length > 0 ? pivotData : [
        { id: 1, category: 'Sample', value: 0 }
      ];
      
      // Safely get sheet names
      const sheetNames = Object.keys(sheets || {});
      
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {sheetNames.map(sheetName => (
              <Button
                key={sheetName}
                variant={activeSheet === sheetName ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  try {
                    setActiveSheet(sheetName);
                  } catch (error) {
                    console.error("Error setting active sheet:", error);
                  }
                }}
              >
                {sheetName}
              </Button>
            ))}
          </div>
          
          <div className="pivot-table-wrapper">
            {/* Wrap in error boundary div for safer rendering */}
            <div className="safe-render-container">
              {(() => {
                try {
                  return (
                    <PivotTable data={safePivotData} />
                  );
                } catch (error) {
                  console.error("Error rendering PivotTable:", error);
                  return (
                    <div className="p-4 text-center border border-red-200 bg-red-50 text-red-800 rounded-md">
                      Error displaying pivot table. Please try again.
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering pivot section:", error);
      return (
        <div className="p-4 text-center border border-red-200 bg-red-50 text-red-800 rounded-md">
          Error displaying pivot table. Please try again or select a different file.
        </div>
      );
    }
  };

  const renderAISection = () => {
    const renderAnalysisResults = () => {
      if (!aiAnalysis) return null;
      
      try {
        // Validate aiAnalysis is an object
        if (!aiAnalysis || typeof aiAnalysis !== 'object') {
          return <div className="p-4 text-center text-muted-foreground">Invalid analysis data</div>;
        }
        
        // Safely destructure with defaults
        const { 
          title = 'Analysis Results', 
          timestamp = new Date().toISOString(), 
          sections = [] 
        } = aiAnalysis;
        
        // Validate sections is an array
        if (!Array.isArray(sections)) {
          return <div className="p-4 text-center text-muted-foreground">Invalid analysis data structure</div>;
        }
        
        const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown date';
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{title || 'Analysis Results'}</h2>
                <p className="text-sm text-muted-foreground">Generated on {formattedDate}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAiAnalysis(null)}>
                Reset
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, index) => {
                // Validate section has required properties
                if (!section || typeof section !== 'object') {
                  return <div key={index} className="p-4 text-center text-muted-foreground">Invalid section data</div>;
                }
                
                const sectionTitle = section.title || 'Untitled Section';
                const sectionType = section.type || 'unknown';
                const items = Array.isArray(section.items) ? section.items : [];
                
                return (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2 bg-muted/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {sectionType === "insights" && <BarChart2 className="h-5 w-5 text-primary" />}
                        {sectionType === "recommendations" && <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        {sectionType === "anomalies" && <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        {sectionType === "quality" && <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {sectionTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {sectionType === "insights" && (
                        <ul className="space-y-3">
                          {items.map((item, i) => {
                            if (!item || typeof item !== 'object') {
                              return <li key={i} className="text-muted-foreground">Invalid item data</li>;
                            }
                            const text = item.text || 'No description';
                            const value = item.value || 'N/A';
                            const sentiment = item.sentiment || 'neutral';
                            
                            return (
                              <li key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    sentiment === "positive" ? "bg-green-500" : 
                                    sentiment === "negative" ? "bg-red-500" : "bg-yellow-500"
                                  }`}></div>
                                  <span>{text}</span>
                                </div>
                                <Badge variant={
                                  sentiment === "positive" ? "default" : 
                                  sentiment === "negative" ? "destructive" : "outline"
                                }>
                                  {value}
                                </Badge>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      
                      {sectionType === "recommendations" && (
                        <ul className="space-y-3">
                          {items.map((item, i) => {
                            if (!item || typeof item !== 'object') {
                              return <li key={i} className="text-muted-foreground">Invalid item data</li>;
                            }
                            const text = item.text || 'No recommendation';
                            const priority = item.priority || 'low';
                            
                            return (
                              <li key={i} className="flex items-start gap-3">
                                <Badge variant={
                                  priority === "high" ? "destructive" : 
                                  priority === "medium" ? "default" : "outline"
                                } className="mt-0.5">
                                  {priority}
                                </Badge>
                                <span>{text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      
                      {sectionType === "anomalies" && (
                        <ul className="space-y-3">
                          {items.map((item, i) => {
                            if (!item || typeof item !== 'object') {
                              return <li key={i} className="text-muted-foreground">Invalid item data</li>;
                            }
                            const text = item.text || 'No anomaly description';
                            const severity = item.severity || 'none';
                            
                            return (
                              <li key={i} className="flex items-center gap-2">
                                {severity !== "none" ? (
                                  <Badge variant="destructive">{severity}</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                    No anomalies
                                  </Badge>
                                )}
                                <span>{text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      
                      {sectionType === "quality" && (
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Data Quality Score</span>
                              <span className={`font-bold text-lg ${
                                (section.score || 0) >= 90 ? "text-green-600 dark:text-green-400" : 
                                (section.score || 0) >= 70 ? "text-yellow-600 dark:text-yellow-400" : 
                                "text-red-600 dark:text-red-400"
                              }`}>{section.score || 0}/100</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  (section.score || 0) >= 90 ? "bg-green-500" : 
                                  (section.score || 0) >= 70 ? "bg-yellow-500" : "bg-red-500"
                                }`} 
                                style={{ width: `${section.score || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-3 rounded-md border border-border">
                            <div className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm">{section.details || 'No details available'}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="flex flex-col items-center p-2 bg-muted/20 rounded-md border border-border">
                              <span className="text-xs text-muted-foreground">Completeness</span>
                              <span className="font-medium">98%</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-muted/20 rounded-md border border-border">
                              <span className="text-xs text-muted-foreground">Consistency</span>
                              <span className="font-medium">95%</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-muted/20 rounded-md border border-border">
                              <span className="text-xs text-muted-foreground">Accuracy</span>
                              <span className="font-medium">90%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      } catch (error) {
        console.error("Error rendering AI analysis:", error);
        return (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Error displaying AI analysis results. Please try again.
          </div>
        );
      }
    };
    
    return (
      <div className="space-y-4">
        {!aiAnalysis && !isAnalyzing ? (
          <div className="bg-muted/50 p-8 rounded-md text-center border border-dashed">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Brain className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-medium">AI Analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Generate insights, detect patterns, and receive recommendations based on the file data.
              </p>
              <Button onClick={handleRunAIAnalysis} className="mt-2" size="lg">
                Run AI Analysis
              </Button>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="bg-muted/50 p-8 rounded-md text-center border">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-pulse p-4 rounded-full bg-primary/10">
                <Brain className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Analyzing Data...</h3>
              <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
              </div>
              <p className="text-muted-foreground">
                Our AI is examining patterns and generating insights from your file.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {renderAnalysisResults()}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-[90%] max-w-4xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Loading Preview: {fileName}</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] flex items-center justify-center">
              <div className="animate-pulse text-center">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className={`${isFullscreen ? 'fixed inset-0 bg-background z-50' : 'relative w-full'}`}
    >
      <Card className={`${isFullscreen ? 'h-screen rounded-none' : 'w-full overflow-x-auto'}`}>
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-xl">{fileName}</CardTitle>
              <Badge variant="outline">{fileId}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? 
                  <Minimize2 className="h-4 w-4" /> : 
                  <Maximize2 className="h-4 w-4" />
                }
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <div className="p-4">
          <Tabs 
            defaultValue="data" 
            value={activeSection}
            onValueChange={(value) => setActiveSection(value as 'data' | 'pivot' | 'ai')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="data" className="flex items-center space-x-2">
                <TableIcon className="h-4 w-4" />
                <span>Data</span>
              </TabsTrigger>
              <TabsTrigger value="pivot" className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4" />
                <span>Pivot Table</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="mt-0">
              {renderDataSection()}
            </TabsContent>
            
            <TabsContent value="pivot" className="mt-0">
              {renderPivotSection()}
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              {renderAISection()}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedFilePreview;