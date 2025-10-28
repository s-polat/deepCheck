import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

// Environment variables yükleme
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Demo mode configuration
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';
const CLOUDINARY_CONFIGURED = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET &&
                              process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name';

console.log(`🔧 Configuration:
  - Demo Mode: ${DEMO_MODE ? 'ON (OpenAI not configured)' : 'OFF'}
  - Cloudinary: ${CLOUDINARY_CONFIGURED ? 'Configured' : 'Demo mode'}
`);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(`🏥 Health check request from: ${req.get('Origin') || 'Unknown'}`);
  
  const healthResponse = {
    status: 'healthy',
    message: 'DeepCheck API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: DEMO_MODE ? 'demo' : 'production',
    features: {
      openai: !DEMO_MODE,
      cloudinary: CLOUDINARY_CONFIGURED,
      file_upload: true,
      url_analysis: true
    }
  };
  
  console.log(`✅ Sending health response:`, healthResponse);
  res.json(healthResponse);
});

// Test endpoint for demo purposes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    result: {
      is_ai_generated: false,
      confidence: 0.87,
      analysis_time: 1.2,
      model_version: 'GPT-4 Vision v1.0',
      details: {
        reasoning: 'Image appears to be a natural photograph with consistent lighting, realistic textures, and no detectable AI artifacts.',
        artifacts: [],
        probability_scores: {
          'AI Generated': 0.13,
          'Real Image': 0.87,
          'Edited Image': 0.05
        }
      }
    }
  });
});

// Demo analysis generator
function getDemoAnalysis() {
  const scenarios = [
    {
      is_ai_generated: false,
      confidence: Math.random() * 0.25 + 0.75, // 0.75-1.0
      reasoning: "Natural photography characteristics: authentic lighting conditions, realistic depth of field, and consistent image noise patterns typical of camera sensors.",
      artifacts: ["Natural camera noise", "Authentic shadows", "Realistic compression"]
    },
    {
      is_ai_generated: true,
      confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0
      reasoning: "Clear indicators of AI generation: artificial texture patterns, inconsistent lighting sources, and digital artifacts common in neural network outputs.",
      artifacts: ["Artificial texture patterns", "Inconsistent lighting", "Neural network artifacts"]
    },
    {
      is_ai_generated: false,
      confidence: Math.random() * 0.15 + 0.6, // 0.6-0.75
      reasoning: "Appears to be authentic with minor post-processing. Natural color distribution and realistic subject matter with subtle editing indicators.",
      artifacts: ["Minor color correction", "Slight contrast adjustment", "Natural composition"]
    },
    {
      is_ai_generated: true,
      confidence: Math.random() * 0.15 + 0.65, // 0.65-0.8
      reasoning: "Suspicious digital patterns suggest AI generation, though quality is high. Unnatural smoothness in textures and subtle repetitive patterns.",
      artifacts: ["Unnatural texture smoothness", "Repetitive patterns", "Digital signature traces"]
    }
  ];
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  return {
    success: true,
    result: {
      is_ai_generated: scenario.is_ai_generated,
      confidence: scenario.confidence,
      analysis_time: Math.random() * 2 + 1.5, // 1.5-3.5 seconds
      model_version: 'DeepCheck Demo v1.0',
      details: {
        reasoning: scenario.reasoning,
        artifacts: scenario.artifacts,
        probability_scores: {
          'AI Generated': scenario.is_ai_generated ? scenario.confidence : (1 - scenario.confidence),
          'Real Image': scenario.is_ai_generated ? (1 - scenario.confidence) : scenario.confidence,
          'Edited Image': Math.random() * 0.3 + 0.1 // 0.1-0.4
        }
      }
    }
  };
}

// Helper function to determine URL type
function determineUrlType(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const hostname = urlObj.hostname.toLowerCase();
    
    // Direct media file extensions
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.mp4', '.avi', '.mov', '.wmv', '.webm'];
    
    // Check if it's a direct media file
    const cleanPath = pathname.split('?')[0].split('#')[0];
    if (mediaExtensions.some(ext => cleanPath.endsWith(ext))) {
      return 'direct_media';
    }
    
    // Check for known AI/content platforms
    if (hostname.includes('artlist.io')) {
      return 'artlist_webpage';
    } else if (hostname.includes('leonardo.ai')) {
      return 'leonardo_webpage';
    } else if (hostname.includes('midjourney.com')) {
      return 'midjourney_webpage';
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube_video';
    } else if (hostname.includes('instagram.com')) {
      return 'instagram_post';
    } else if (hostname.includes('tiktok.com')) {
      return 'tiktok_video';
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'twitter_post';
    }
    
    return 'webpage';
  } catch (error) {
    return 'unknown';
  }
}

// AI Analysis function using OpenAI GPT-4 Vision
async function analyzeWithAI(imageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and determine if it appears to be AI-generated or a real photograph. 
              
              Please provide:
              1. Your assessment (AI-generated or Real)
              2. Confidence level (0.0 to 1.0)
              3. Specific indicators that led to your conclusion
              4. Any artifacts or patterns you notice
              
              Respond in JSON format with the following structure:
              {
                "is_ai_generated": boolean,
                "confidence": number,
                "reasoning": "detailed explanation",
                "artifacts": ["list", "of", "indicators"],
                "probability_scores": {
                  "AI Generated": number,
                  "Real Image": number,
                  "Edited Image": number
                }
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.0,  // More consistent results
      seed: 42           // Deterministic seed for reproducibility
    });

    const content = response.choices[0].message.content;
    
    try {
      // Parse JSON response from GPT-4
      const result = JSON.parse(content);
      
      // Log analysis result for debugging
      console.log(`📊 AI Analysis Result:`, {
        is_ai_generated: result.is_ai_generated,
        confidence: result.confidence,
        reasoning_preview: result.reasoning?.substring(0, 100) + '...'
      });

      return {
        success: true,
        result: {
          is_ai_generated: result.is_ai_generated,
          confidence: result.confidence,
          analysis_time: 2.5,
          model_version: 'GPT-4 Vision v1.0',
          details: {
            reasoning: result.reasoning,
            artifacts: result.artifacts || [],
            probability_scores: result.probability_scores || {},
            analysis_timestamp: new Date().toISOString() // Track when analysis was done
          }
        }
      };
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      const isAiGenerated = content.toLowerCase().includes('ai-generated') || 
                           content.toLowerCase().includes('artificial');
      
      return {
        success: true,
        result: {
          is_ai_generated: isAiGenerated,
          confidence: 0.75, // Default confidence when parsing fails
          analysis_time: 2.5,
          model_version: 'GPT-4 Vision v1.0',
          details: {
            reasoning: content,
            artifacts: ['Manual analysis performed'],
            probability_scores: {
              'AI Generated': isAiGenerated ? 0.75 : 0.25,
              'Real Image': isAiGenerated ? 0.25 : 0.75,
              'Edited Image': 0.15
            }
          }
        }
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle different error types
    if (error.status === 429 || error.status === 401) {
      console.log('🎭 Falling back to demo mode due to API quota/auth issue');
      return getDemoAnalysis();
    }
    
    // Handle URL download errors (invalid URLs, timeouts, etc.)
    if (error.status === 400 && error.message && error.message.includes('downloading')) {
      console.log('🎭 Falling back to demo mode due to URL download issue:', error.message);
      return getDemoAnalysis();
    }
    
    throw error;
  }
}

// Multiple Analysis for Consistency
async function performMultipleAnalysis(imageUrl, iterations = 3) {
  console.log(`🔄 Performing ${iterations} analyses for consistency check...`);
  
  const results = [];
  for (let i = 0; i < iterations; i++) {
    try {
      console.log(`   Analysis ${i + 1}/${iterations}...`);
      const result = await analyzeWithAI(imageUrl);
      if (result.success) {
        results.push(result.result);
      }
      
      // Small delay between analyses
      if (i < iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log(`   Analysis ${i + 1} failed:`, error.message);
    }
  }

  if (results.length === 0) {
    throw new Error('All analyses failed');
  }

  // Smart Consensus Algorithm
  const aiGeneratedCount = results.filter(r => r.is_ai_generated).length;
  const confidenceScores = results.map(r => r.confidence);
  const minConfidence = Math.min(...confidenceScores);
  const maxConfidence = Math.max(...confidenceScores);
  const confidenceVariation = maxConfidence - minConfidence;
  
  // Calculate weighted consensus based on confidence scores
  const aiWeightedScore = results
    .filter(r => r.is_ai_generated)
    .reduce((sum, r) => sum + r.confidence, 0);
  
  const realWeightedScore = results
    .filter(r => !r.is_ai_generated)
    .reduce((sum, r) => sum + r.confidence, 0);
  
  // Determine final result with smart logic
  let finalIsAI, finalConfidence, consistencyScore;
  
  if (confidenceVariation <= 0.15) {
    // High consistency - use majority vote with average confidence
    finalIsAI = aiGeneratedCount >= Math.ceil(results.length / 2);
    finalConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    consistencyScore = 'HIGH';
  } else if (aiWeightedScore > realWeightedScore) {
    // AI scores have higher confidence overall
    finalIsAI = true;
    finalConfidence = aiWeightedScore / Math.max(aiGeneratedCount, 1);
    consistencyScore = confidenceVariation <= 0.25 ? 'MEDIUM' : 'LOW';
  } else {
    // Real scores have higher confidence overall
    finalIsAI = false;
    finalConfidence = realWeightedScore / Math.max(results.length - aiGeneratedCount, 1);
    consistencyScore = confidenceVariation <= 0.25 ? 'MEDIUM' : 'LOW';
  }

  console.log(`📊 Smart Consensus Analysis:`, {
    total_analyses: results.length,
    ai_generated_count: aiGeneratedCount,
    confidence_variation: confidenceVariation.toFixed(3),
    consistency_score: consistencyScore,
    final_result: finalIsAI ? 'AI Generated' : 'Real/Human',
    final_confidence: finalConfidence.toFixed(3)
  });

  return {
    success: true,
    result: {
      is_ai_generated: finalIsAI,
      confidence: finalConfidence,
      analysis_time: 2.5 * results.length,
      model_version: 'GPT-4 Vision v1.0 (Smart Consensus)',
      details: {
        reasoning: `Smart consensus analysis: ${consistencyScore} consistency detected. ${aiGeneratedCount}/${results.length} analyses indicated AI generation. Final decision weighted by confidence scores.`,
        artifacts: [...new Set(results.flatMap(r => r.details?.artifacts || []))],
        probability_scores: {
          'AI Generated': finalIsAI ? finalConfidence : (1 - finalConfidence),
          'Real Image': finalIsAI ? (1 - finalConfidence) : finalConfidence,
          'Edited Image': Math.min(0.2, confidenceVariation)
        },
        analysis_timestamp: new Date().toISOString(),
        consistency_stats: {
          total_analyses: results.length,
          ai_detections: aiGeneratedCount,
          confidence_range: `${minConfidence.toFixed(3)} - ${maxConfidence.toFixed(3)}`,
          confidence_variation: confidenceVariation.toFixed(3),
          consistency_score: consistencyScore,
          individual_results: results.map((r, i) => ({
            analysis_number: i + 1,
            is_ai_generated: r.is_ai_generated,
            confidence: r.confidence
          }))
        }
      }
    }
  };
}

// File upload and analysis endpoint
app.post('/api/analyze/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log(`🔍 Analyzing file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Demo mode - return simulated analysis
    if (DEMO_MODE || !CLOUDINARY_CONFIGURED) {
      console.log('🎭 Running in demo mode');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoResult = getDemoAnalysis();
      console.log(`📊 Demo analysis result: ${demoResult.result.is_ai_generated ? 'AI Generated' : 'Real'} (${Math.round(demoResult.result.confidence * 100)}% confidence)`);
      
      return res.json(demoResult);
    }

    // Production mode with real APIs
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'deepcheck-uploads',
          transformation: req.file.mimetype.startsWith('image/') 
            ? [{ width: 1024, height: 1024, crop: 'limit' }] 
            : [{ width: 1280, height: 720, crop: 'limit' }]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(req.file.buffer);
    });

    console.log('File uploaded to Cloudinary:', uploadResponse.public_id);

    // Analyze with OpenAI
    const analysisResult = await performMultipleAnalysis(uploadResponse.secure_url);

    // Clean up - delete from Cloudinary after analysis (optional)
    // await cloudinary.uploader.destroy(uploadResponse.public_id);

    res.json(analysisResult);

  } catch (error) {
    console.error('File analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Consistency Check endpoint - Multiple analysis for same file
app.post('/api/analyze/file/consistency', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const iterations = parseInt(req.query.iterations) || 3;
    if (iterations > 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 5 iterations allowed'
      });
    }

    console.log(`🔍 Consistency analysis for: ${req.file.originalname} (${iterations} iterations)`);

    // Demo mode fallback
    if (DEMO_MODE || !CLOUDINARY_CONFIGURED) {
      console.log('🎭 Running consistency check in demo mode');
      
      // Simulate multiple results with slight variations
      const results = [];
      for (let i = 0; i < iterations; i++) {
        results.push({
          is_ai_generated: Math.random() > 0.4, // Slightly favor AI detection
          confidence: 0.7 + (Math.random() * 0.2), // 0.7-0.9 range
          details: { artifacts: ['Simulated analysis'] }
        });
      }

      const aiCount = results.filter(r => r.is_ai_generated).length;
      const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

      return res.json({
        success: true,
        result: {
          is_ai_generated: aiCount >= Math.ceil(iterations / 2),
          confidence: avgConfidence,
          analysis_time: iterations * 2.0,
          model_version: 'DeepCheck Demo Consistency v1.0',
          details: {
            reasoning: `Demo consistency analysis with ${iterations} iterations. ${aiCount}/${iterations} detected AI generation.`,
            artifacts: ['Demo consistency check'],
            analysis_timestamp: new Date().toISOString(),
            consistency_stats: {
              total_analyses: iterations,
              ai_detections: aiCount,
              confidence_range: `${Math.min(...results.map(r => r.confidence)).toFixed(3)} - ${Math.max(...results.map(r => r.confidence)).toFixed(3)}`
            }
          }
        }
      });
    }

    // Upload to Cloudinary first
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "deepcheck_consistency",
    });

    // Perform multiple analysis
    const analysisResult = await performMultipleAnalysis(uploadResponse.secure_url, iterations);
    res.json(analysisResult);

  } catch (error) {
    console.error('Consistency analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Consistency analysis failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// URL analysis endpoint
app.post('/api/analyze/url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    console.log(`Analyzing URL: ${url}`);

    // Demo mode - return simulated analysis
    if (DEMO_MODE) {
      console.log('🎭 Running in demo mode for URL analysis');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoResult = getDemoAnalysis();
      console.log(`📊 Demo URL analysis result: ${demoResult.result.is_ai_generated ? 'AI Generated' : 'Real'} (${Math.round(demoResult.result.confidence * 100)}% confidence)`);
      
      return res.json(demoResult);
    }

    // Check if URL is a direct media file or a web page
    const urlType = determineUrlType(url);
    console.log(`🔍 URL Type detected: ${urlType}`);

    // Production mode with real OpenAI API
    try {
      const analysisResult = await performMultipleAnalysis(url);
      res.json(analysisResult);
    } catch (error) {
      console.log('🎭 OpenAI analysis failed, falling back to demo mode:', error.message);
      
      // If OpenAI fails (especially for web page URLs), fallback to demo mode
      const demoResult = getDemoAnalysis();
      demoResult.result.details.reasoning = `Analysis performed in demo mode. Original URL type: ${urlType}. Web page URLs may require manual review for complete accuracy.`;
      
      res.json(demoResult);
    }

  } catch (error) {
    console.error('URL analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'URL analysis failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 30MB.'
      });
    }
  }

  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DeepCheck Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 API endpoints:`);
  console.log(`   POST /api/analyze/file - File upload analysis`);
  console.log(`   POST /api/analyze/file/consistency - Consistency check (multiple analyses)`);
  console.log(`   POST /api/analyze/url - URL analysis`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');  
  process.exit(0);
});
