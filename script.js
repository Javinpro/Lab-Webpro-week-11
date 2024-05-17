$(document).ready(function() {
    const $shapeContainer = $('#shapeContainer');
    const containerWidth = $shapeContainer.width();
    const containerHeight = $shapeContainer.height();
    let shapeCount = 0;
    let canAddOrRemove = true;
    const shapeMargin = 10; // 10px space between shapes
    let currentRowMaxHeight = 0; // Track the maximum height in the current row

    function getShapeProperties() {
        const shapeType = $('#shapeType').val();
        const shapeColor = $('#shapeColor').val();
        const shapeSize = parseInt($('#shapeSize').val(), 10);
        return { shapeType, shapeColor, shapeSize };
    }

    $('#addShape').on('click', async function() {
        if (!canAddOrRemove) return;
        canAddOrRemove = false;
        
        const { shapeType, shapeColor, shapeSize } = getShapeProperties();
        const $newShape = $('<div class="shape"></div>').css({
            width: shapeSize,
            height: shapeSize,
            backgroundColor: shapeColor,
            borderRadius: shapeType === 'circle' ? '50%' : '0%',
            position: 'absolute',
            top: 0,
            left: -shapeSize, // Start position for sliding in from the left
            display: 'block',
            margin: shapeMargin / 2 // Apply half margin to all sides
        });

        // Calculate new position
        let lastShape = $shapeContainer.children().last();
        let xPos = 0, yPos = 0;

        if (lastShape.length > 0) {
            let lastShapePos = lastShape.position();
            let lastShapeWidth = lastShape.outerWidth();
            let lastShapeHeight = lastShape.outerHeight();

            xPos = lastShapePos.left + lastShapeWidth + shapeMargin;

            if (xPos + shapeSize + shapeMargin > containerWidth) {
                xPos = 0;
                yPos = lastShapePos.top + currentRowMaxHeight + shapeMargin;
                currentRowMaxHeight = shapeSize; // Reset max height for new row
            } else {
                yPos = lastShapePos.top;
                currentRowMaxHeight = Math.max(currentRowMaxHeight, shapeSize);
            }
        } else {
            currentRowMaxHeight = shapeSize; // Initialize max height for the first row
        }

        if (yPos + shapeSize + shapeMargin > containerHeight) {
            alert('No more space to add shapes');
            canAddOrRemove = true;
            return;
        }

        $newShape.css({ top: yPos, left: -shapeSize }).appendTo($shapeContainer);
        $newShape.animate({ left: xPos }, 'slow', function() {
            shapeCount++;
            canAddOrRemove = true;
        });
    });

    $('#removeShape').on('click', async function() {
        if (!canAddOrRemove || shapeCount === 0) return;
        canAddOrRemove = false;
        
        const lastShape = $shapeContainer.children().last();
        lastShape.fadeOut('slow', function() {
            $(this).remove();
            shapeCount--;
            // Recalculate max height for the current row if a shape is removed
            if (shapeCount > 0) {
                let newRowMaxHeight = 0;
                let shapesInRow = $shapeContainer.children().filter(function() {
                    return $(this).position().top === lastShape.position().top;
                });
                shapesInRow.each(function() {
                    newRowMaxHeight = Math.max(newRowMaxHeight, $(this).outerHeight());
                });
                currentRowMaxHeight = newRowMaxHeight;
            } else {
                currentRowMaxHeight = 0; // Reset max height if no shapes are left
            }
            canAddOrRemove = true;
        });
    });
});
