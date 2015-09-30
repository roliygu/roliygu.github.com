<script type="text/template" id="main-view-tpl">
    <div>
        <div class='echarts'>
            <div>
                <button class="btn-primary scatter-test-data">下载测试数据</button>
                <button class="btn-success choose-which-dimension-btn">选择展现的列</button>
            </div>
            <div>
                <input class="file-input jfilestyle" type="file" data-theme="blue" data-input="false">
                <div class='echarts-view'></div>
            </div>
        </div>
    </div>
</script>

<script type="text/template" id="choose-which-dimension-tpl">
    <div>
        <p>选择要展示的列</p>
        <div>
            <select class="form-control input-sm choose-x" placeholder="选择x轴的列"></select>
            <select class="form-control input-sm choose-y" placeholder="选择y轴的列"></select>
        </div>
        <p>或者你可以选择,'帮我降到2维'</p>
    </div>
</script>