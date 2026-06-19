/**
 * site-helper.js – 页面提示卡片、关键词徽章与访问说明
 * 用于 https://index-portal-leyusports.com.cn 的轻量辅助脚本
 * 核心关键词：乐鱼体育
 * 无第三方依赖，纯原生 DOM 操作
 */

(function() {
  'use strict';

  // ---------- 配置数据 ----------
  const CONFIG = {
    portalUrl: 'https://index-portal-leyusports.com.cn',
    keyword: '乐鱼体育',
    badgeColor: '#ff6a00',
    cardBg: '#f0f8ff',
    cardBorder: '#b0d4f1',
    expireDays: 7
  };

  // ---------- 实用工具 ----------
  function createElement(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(key => {
        if (key === 'style' && typeof attrs[key] === 'object') {
          Object.assign(el.style, attrs[key]);
        } else if (key === 'className') {
          el.className = attrs[key];
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }
    if (children) {
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          el.appendChild(child);
        }
      });
    }
    return el;
  }

  // ---------- 关键词徽章 ----------
  function createKeywordBadge(keyword, color) {
    const badge = createElement('span', {
      style: {
        display: 'inline-block',
        padding: '4px 12px',
        margin: '4px',
        borderRadius: '20px',
        backgroundColor: color || CONFIG.badgeColor,
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'default',
        userSelect: 'none'
      }
    }, [keyword]);
    return badge;
  }

  // ---------- 提示卡片 ----------
  function createTipCard(message, bg, border) {
    const card = createElement('div', {
      style: {
        backgroundColor: bg || CONFIG.cardBg,
        border: '2px solid ' + (border || CONFIG.cardBorder),
        borderRadius: '12px',
        padding: '16px 20px',
        margin: '16px 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333'
      }
    }, [
      createElement('div', { style: { fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' } }, ['📌 提示']),
      createElement('p', { style: { margin: '0 0 8px 0' } }, [message]),
    ]);
    return card;
  }

  // ---------- 访问说明 ----------
  function createAccessNotice() {
    const notice = createElement('div', {
      style: {
        backgroundColor: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: '8px',
        padding: '12px 16px',
        margin: '12px 0',
        fontSize: '14px',
        color: '#7a6e20'
      }
    }, [
      createElement('strong', {}, ['访问说明：']),
      document.createTextNode(' 当前页面关联 ' + CONFIG.portalUrl + '，核心关键词为「' + CONFIG.keyword + '」。'),
      createElement('br'),
      document.createTextNode(' 建议使用最新版浏览器，并关注页面更新。如遇问题请稍后再试。')
    ]);
    return notice;
  }

  // ---------- 将元素插入页面合适位置 ----------
  function injectUI() {
    // 如果已有 body 则直接插入，否则等 DOM 就绪
    const run = function() {
      const body = document.body;
      if (!body) {
        setTimeout(run, 100);
        return;
      }

      // 避免重复注入
      if (document.querySelector('[data-site-helper="true"]')) return;

      // 创建一个容器，标记已注入
      const container = createElement('div', {
        'data-site-helper': 'true',
        style: {
          padding: '10px 20px',
          maxWidth: '800px',
          margin: '0 auto'
        }
      });

      // 1. 关键词徽章（可展示多个，这里展示一个）
      const badge = createKeywordBadge(CONFIG.keyword, CONFIG.badgeColor);
      const badgeWrapper = createElement('div', { style: { marginBottom: '8px' } }, [badge]);
      container.appendChild(badgeWrapper);

      // 2. 提示卡片
      const tipMsg = '欢迎访问基于 ' + CONFIG.portalUrl + ' 的内容。' +
                     '本页面围绕「' + CONFIG.keyword + '」提供信息展示。';
      const card = createTipCard(tipMsg);
      container.appendChild(card);

      // 3. 访问说明
      const notice = createAccessNotice();
      container.appendChild(notice);

      // 将容器插入到页面最前面（或第一个元素之前）
      const firstChild = body.firstChild;
      if (firstChild) {
        body.insertBefore(container, firstChild);
      } else {
        body.appendChild(container);
      }
    };

    // 监听 DOMContentLoaded 或立即执行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  // ---------- 启动 ----------
  injectUI();

})();