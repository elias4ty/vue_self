import createRenderder from '@core/renderer';
import { vnode } from '@core/renderer/vdom';
import browser from '@core/renderer/config/browser';

const renderer = createRenderder(browser);

renderer.render(vnode, document.querySelector('#app'));