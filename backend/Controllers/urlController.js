import { createShortUrl, processRedirect, getUrlAnalytics, deleteShortUrl, updateShortUrl } from '../services/urlService.js';

export const handleShorten = async (req, res, next) => {
  try {
    const { originalUrl, customAlias } = req.body;
    const newUrl = await createShortUrl(originalUrl, customAlias);
    
    res.status(201).json({
      success: true,
      data: {
        shortCode: newUrl.shortCode,
        originalUrl: newUrl.originalUrl,
        expiresAt: newUrl.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    const reqInfo = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
      referer: req.headers['referer'] || req.headers['referrer'] || 'Direct'
    };

    const redirectUrl = await processRedirect(shortCode, reqInfo);
    res.redirect(302, redirectUrl);

  } catch (error) {
    if (error.statusCode === 404) {
       return res.status(404).send('URL not found');
    }
    if (error.statusCode === 410) {
       return res.status(410).send('This link has expired');
    }
    next(error);
  }
};

export const handleGetStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const stats = await getUrlAnalytics(shortCode);
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
};

export const handleDelete = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    await deleteShortUrl(shortCode);
    
    res.status(200).json({
      success: true,
      message: "URL deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

export const handleUpdate = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const updates = req.body;
    
    const updatedUrl = await updateShortUrl(shortCode, updates);
    
    res.status(200).json({
      success: true,
      data: updatedUrl
    });

  } catch (error) {
    next(error);
  }
};
