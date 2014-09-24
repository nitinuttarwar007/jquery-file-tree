function setupEmptyFixture(){
    jasmine.getFixtures().set('<div id="test"></div>');
}

function setupUlFixture(){
    jasmine.getFixtures().set('<ul id="test"><li>A<ul><li>AA<ul><li>003</li><li>004</li></ul></li><li>001</li><li>002</li></ul></li><li>B<ul><li>B</li><li>01</li><li>02</li></ul></li></ul>');
}


var data = [{"name":"A","type":"folder","children":[{"name":"001","ext":"txt","type":"file"},{"name":"002","ext":"txt","type":"file"},{"name":"AA","type":"folder","children":[{"name":"003","ext":"txt","type":"file"},{"name":"004","ext":"txt","type":"file"}]}]},{"name":"B","type":"folder","children":[{"name":"01","ext":"jpg","type":"file"},{"name":"02","ext":"jpg","type":"file"},{"name":"B","type":"folder","children":[]}]}],
    button;

function init(data, options){
    $.fx.off = true;

    return $("#test").filetree({
        data: data
    });
}

describe("filetree", function() {
    
    describe("Events", function() {

        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('> button');
        });


        it("should trigger click events", function() {
            
            var spy_folder = spyOnEvent('li.folder:first > a', 'click.folder.filetree');
            var spy_file = spyOnEvent('li.file:first > a', 'click.file.filetree');

            $('li.folder:first > a').trigger('click');
            
            expect('click.folder.filetree').toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_folder).toHaveBeenTriggered();

            $('li.file:first > a').trigger('click');
            
            expect('click.file.filetree').toHaveBeenTriggeredOn('li.file:first > a');
            expect(spy_file).toHaveBeenTriggered();
        });


        it("should trigger open/close events", function() {
            
            var spy_open = spyOnEvent('li.folder:first > a', 'open.folder.filetree');
            var spy_opened = spyOnEvent('li.folder:first > a', 'opened.folder.filetree');
            var spy_close = spyOnEvent('li.folder:first > a', 'close.folder.filetree');
            var spy_closed = spyOnEvent('li.folder:first > a', 'closed.folder.filetree');

            button.trigger('click');

            expect('open.folder.filetree').toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_open).toHaveBeenTriggered();
            
            expect('opened.folder.filetree').toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_opened).toHaveBeenTriggered();
    
            button.trigger('click');

            expect('close.folder.filetree').toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_close).toHaveBeenTriggered();

            expect('closed.folder.filetree').toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_closed).toHaveBeenTriggered();
        });
        
    });

    describe("Methods", function(){
        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('button');
        });

        it("should destroy properly", function(){
            $('#test').filetree('destroy');

            var spy_open = spyOnEvent('li.folder:first > a', 'open.folder.filetree');
            var spy_opened = spyOnEvent('li.folder:first > a', 'opened.folder.filetree');
            var spy_close = spyOnEvent('li.folder:first > a', 'close.folder.filetree');
            var spy_closed = spyOnEvent('li.folder:first > a', 'closed.folder.filetree');

            button.trigger('click');

            expect('open.folder.filetree').not.toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_open).not.toHaveBeenTriggered();
            
            expect('opened.folder.filetree').not.toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_opened).not.toHaveBeenTriggered();
    
            button.trigger('click');

            expect('close.folder.filetree').not.toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_close).not.toHaveBeenTriggered();

            expect('closed.folder.filetree').not.toHaveBeenTriggeredOn('li.folder:first > a');
            expect(spy_closed).not.toHaveBeenTriggered();

            expect('#test').toBeEmpty();
        })
    });

    describe("Classes", function(){

        beforeEach(function(){
            setupEmptyFixture();
            init(data);
            button = $('li.folder').eq(0).find('button');
        });

        it("should assign proper classes", function(){

            folder = $('li.folder').eq(0);
            
            expect(folder).toHaveClass('collapsed');

            button.trigger('click');

            expect(folder).toHaveClass('expanded');
    
            button.trigger('click');

            expect(folder).toHaveClass('collapsed');
            
        })
    });

    describe("DOM as source", function(){

        beforeEach(function(){
            setupUlFixture();
            init([]);
            button = $('li.folder').eq(0).find('button');
        });

        it("must assign proper classes",function(){
            root = $('#test');
            expect(root).toHaveClass('filetree');
        });

        xit("should wrap text in anchors", function() {
            expect($('li')).toContainElement('a');
            expect($('li > a')).not.toContainElement('ul');
        });

    });
});